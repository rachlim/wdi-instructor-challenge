// GLOBAL VAR
var __OMDB = '//www.omdbapi.com/?';
var __BASE = window.location;

(function($) {
  // SHARED FUNCTIONS
  // these function called from different flow
  // purposely separated so it can work independently

  // this function is mainly to reset the site as to it's initial state
  // e.g. form reset, emptied result list, hide all post-submit css states
  function resetFlow() {
    $('.result-list').empty();
    $('form').trigger('reset');
    $('button.active').removeClass('active');
    $(".input input").trigger('blur');
    $('#search-spinner').fadeOut('slow');
  }

  // this function is a gateway function that calls the ajax functions
  // that interacts with the oMDB API
  // the function is mainly created so it can also allow pagination to reuse its logic
  function getMoviesFlow(params, type) {
    getMovies(params, function(results) {
      $('.alert-container').fadeOut();
      resetFlow();

      if ('True' == results.Response) {
        listResults(results.Search, false);
        checkFavStatus();

        //if the trigger for this function comes from "search"
        //reset back all the pagination
        if(type === 'search') {
          resetPagination(results, params);
        }
      } else {
        $('.paginator').fadeOut();
        $('.result-list').html('<h2>' + results.Error + '</h2>');
      }
    });
  }

  // the ajax function that interacts with oMDB API
  // returns with a callback function once it's done retrieving the result from the api
  function getMovies(params, callback) {
    $.ajax({
      type: 'GET',
      url: __OMDB + params
    }).done(function(results) {
      callback(results);
    });
  }

  function getMovieDetails(imdb_id, callback) {
    // TODO: VALIDATE IF IMDB ID IS EMPTY
    var search_params = "i=" + imdb_id + "&type=movie&plot=full&tomatoes=true&r=json";

    $.ajax({
      type: 'GET',
      url: __OMDB + search_params,
      success: function(details) {
        callback(details);
      }
    });
  }

  // this function check each result items whether it has been favorited or not
  function checkFavStatus() {
    var all_fav_links = $('.fav-link');
    var all_fav_in_data = [];

    getFavorites(function(favsData) {
      all_fav_in_data = favsData;

      all_fav_links.each(function(k, favLink) {
        var this_fav_link = $(favLink);
        var fav_imdb_id = this_fav_link.data('imdb');

        for (var i in all_fav_in_data) {
          // if same id is found from data.json as compared to the result list
          // marked the result item as 'favorited' (yellow star)
          if(fav_imdb_id == all_fav_in_data[i].oid) this_fav_link.attr('checked', true);
        }
      });
    });
  }

  // the ajax function that interacts with the back end api endpoints.
  // retrieves all the favorites in the data.json files
  // returns a callback function
  function getFavorites(callback) {
    $.ajax({
      type: 'GET',
      url: __BASE + 'favorites',
      success: function(favorites) {
        callback(favorites);
      }
    });
  }
  // end of shared functions

  // THIS PART HERE COVERS ALL SEARCH MOVIE FLOW
  // $(".submit").click(function(e) {
  //   e.preventDefault();
  //
  //   var form = $('form');
  //   var formData = form.serialize();
  //   var formArr = form.serializeArray();
  //   // get request parameters from form
  //
  //   // make sure the css doesn't flash 'active' (yellow)
  //   $(".favorite").removeClass('active');
  //
  //   // front end validation to check if user types something in the form
  //   if (! formArr[0].value) {
  //     showEmptyError('Please enter your search keyword');
  //   } else {
  //     showSearchResults(formData);
  //   }
  // });

  // this function gets called to fill the error message placeholder
  function showEmptyError(message) {
    $('.paginator').hide();
    $('.alert-container').find('.alert').text(message);
    $('.alert-container').fadeIn('slow');
    resetFlow();
  }

  // called getMoviesFlow function
  function showSearchResults(formData) {
    $('#search-spinner').fadeIn('slow');
    getMoviesFlow(formData, 'search');
  }

  // this function process the data returned by the AJAX calls//
  // and push it to index html
  function listResults(results, inFavorite) {
    var list = [];
    var favLink, favStar, movieTitle, movieLink, detailSection, movieList;
    var resultSpinner = $('.spinner-wrapper');

    //TODO: Refactor this loop
    for (var i in results) {
      // for each results returned
      // create element that will be pushed into the list DOM object

      favLink = $('<input/>', {
                            id: 'fav' + i,
                            class: 'hide fav-link',
                            type: 'checkbox',
                            'data-imdb' : results[i].imdbID,
                            'data-movie-title' : results[i].Title,
                            'data-in-favorite' : inFavorite
                          });
      favStar = $('<label aria-hidden="true" data-icon="&#9733;" for="fav' + i + '" />');


      movieLink = $('<a/>', {
                            class: 'movie-link',
                            href: __BASE.origin + '/movies/' + results[i].imdbID,
                            text: results[i].Title,
                            'data-imdb' : results[i].imdbID,
                          });
      movieTitle = $('<h2/>',{
                          html: movieLink
                      });

      detailSection = $('<section/>');


      movieList = $('<li/>', {
        html: favLink,
        id: results[i].imdbID
      }).append(favStar, movieTitle, detailSection);

      // cloned spinner element for each result item
      resultSpinner
        .clone()
        .attr('id', 'result-spinner-' + results[i].imdbID)
        .addClass('search-spinner')
        .appendTo(detailSection);

      list.push(movieList);
    }

    $('.result-list').append(list);
  }

  // THIS PART HERE COVERS ALL DOM MANIPULATION ON PAGINATION
  // this function reset the pagination states to its initial stage
  // and pass the original search parameter to the pagination element
  // so it'll know what to show on the next page
  function resetPagination(results, params) {
    var totalResultCount = results.totalResults,
        totalPages = Math.ceil(totalResultCount / 10);

    // show pagination only if search result is more than 10 items
    if(totalResultCount > 10) {
      $('.next').removeData('page');
      $('.previous').data('page', 1);

      $('.paginator')
        .show()
        .data('params', params)
        .data('current-page', 1)
        .data('max', totalPages)
        .find('.previous').addClass('disabled')
        .find('.next').removeClass('disabled');
    } else {
      $('.paginator').fadeOut();
    }
  }

  // when pagination button is clicked (next or previous)
  // a call is made again to oMDB api
  // and the pagination element is updated accordingly
  $('.paginator').on('click', '.change-page', function(e) {
    e.preventDefault();

    var paginator = $('.paginator'),
        pager_trigger = $(this),
        all_next = $('.next'),
        all_prev = $('.previous');

    if(pager_trigger.hasClass('disabled')) return false;

    $('.change-page').addClass('disabled');

    var currentPage = paginator.data('current-page'),
        nextPage = ( 'undefined' === typeof( all_next.data('page') ) ) ? currentPage + 1 : all_next.data('page'),
        prevPage = ( 1 < currentPage ) ? currentPage - 1 : currentPage,
        maxPage = paginator.data('max');

    var new_page = (pager_trigger.hasClass('next')) ? nextPage : prevPage;
    var params = paginator.data('params') + '&page=' + new_page;

    getMoviesFlow(params);
    $('.change-page').removeClass('disabled');
    if(new_page == maxPage) all_next.addClass('disabled');
    if(new_page == 1) all_prev.addClass('disabled');

    paginator.data('current-page', new_page);
    all_next.data('page', new_page + 1);
    all_prev.data('page', new_page - 1);
  });

  // THIS PART HERE COVERS ALL DOM MANIPULATION FROM GETTING DETAILS ON MOVIES
  $('.result-list').on('click', '.movie-link', function(e) {
    e.preventDefault();
    var movie = $(this);
    var imdb_id = movie.data('imdb');

    if (! movie.hasClass('active')) {
      var movieSection = movie.parents('li').find('section');
      hideOtherMovies();

      // if movie details already added to the section
      // ignore the flow of AJAX call to get the movie details
      // and just show the section
      if(0 === movieSection.find('.media').length)  {
        $('#result-spinner-' + imdb_id).fadeIn('slow');
        getMovieDetails(imdb_id, function(details) {
          addMovieDetailsToSection(movieSection, details);
        });
      }

      movieSection.fadeIn().addClass('active');
      movie.addClass('active');
    }

    // TODO: close the detail section when opened section is clicked again
  });

  // function that hides all other movie details
  // so only one details gets shown each time
  function hideOtherMovies() {
    $('.result-list').find('section').fadeOut();
    $('.movie-link').removeClass('active');
  }

  // process the results after calling the AJAX to oMDB API
  // adding it into the specific movie section
  function addMovieDetailsToSection(section, details) {
    //TODO REFACTOR THIS APPEND ZILLA
    var detail_container = $('<div class="media" />');
    var movie_poster = $('<div class="media-left" />');
    var poster_link = ('N/A' !== details.Poster) ? $('<a href="' + details.Poster+ '" />') : $('<a href="http://lorempixel.com/250/370" />');
    var poster_url = ('N/A' !== details.Poster) ? $('<img width="250" class="media-object" src="' + details.Poster+ '" />') : $('<img width="250" class="media-object" src="http://lorempixel.com/250/370" />');
    poster_url.appendTo(poster_link);
    poster_link.appendTo(movie_poster);

    var movie_copy = $('<div class="media-body" />');
    var movie_heading = $('<h4 class="media-heading">' + details.Year + '</h4>');
    var movie_plot = $('<p class="plot" />').text(details.Plot);
    var movie_director = $('<h5 class="director" />').text('Director: ' + details.Director);
    var movie_rating = $('<h5 class="rating" />').text('Rating: ' + details.Rated);
    var movie_length = $('<h5 class="length" />').text('Runtime: ' + details.Runtime);
    var movie_imdb_rating = $('<h5 class="imdb_rating" />').text('iMDB Rating: ' + details.imdbRating);

    movie_copy.append(movie_plot)
              .append(movie_director)
              .append(movie_director)
              .append(movie_rating)
              .append(movie_length)
              .append(movie_imdb_rating)
              .prepend(movie_heading);

    detail_container.append(movie_poster, movie_copy);
    section.append(detail_container);
    $('#result-spinner-' + details.imdbID).fadeOut('slow');
  }

  // THIS PART HERE COVERS ALL EVENT ON CLICKING FAVORITE FOR A MOVIE
  $(".favorite").click(function(e) {
    e.preventDefault();
    $('.paginator').fadeOut();
    $(this).addClass('active');

    var allFavs = [];

    getFavorites(function(all_fav_in_data) {
      for (var fav in all_fav_in_data) {
        allFavs.push({
          imdbID: all_fav_in_data[fav].oid,
          Title: all_fav_in_data[fav].name
        });
      }

      if (0 === allFavs.length) {
        showEmptyError('You have not liked any movie. Click on the star!');
      } else {
        $('.alert-container').fadeOut();
        resetFlow();
        listResults(allFavs, true);
        checkFavStatus();
      }
    });
  });

  $('.result-list').on('click', '.fav-link', function() {
    var star = $(this);
    var imdb_id = star.data('imdb');
    var title = star.data('movie-title');

    // check if a movie is already favorited
    // if it is, delete the favorite instead
    if (star.is(":checked")) {
      updateDeleteFavorite('POST', star, imdb_id, title);
    } else {
      updateDeleteFavorite('DELETE', star, imdb_id, title);
    }
  });

  // the ajax call who update or delete the user's favorites movie
  // interact with back end application API endpoint
  function updateDeleteFavorite(type, favlink, oid, name) {
    $.ajax({
      type: type,
      url: __BASE + 'favorites',
      data: {
        name: name,
        oid: oid
      },
      success: function(data) {
        // TODO: do sth after post favorite?

        // remove the movie list, if user currently viewing the favorite list
        if (type == "DELETE" && favlink.data('in-favorite')) {
          $('#'+oid).fadeOut('slow');
        }
      }
    });
  }

  // THIS PART HERE COVERS ALL DOM MANIPULATION FOR AESTHETIC PURPOSES
  // wont explain a lot here, cos it's not the main functionalities
  $(".input input").focus(function() {
    $(this).parent(".input").each(function() {
      $("label", this).css({
        "line-height": "18px",
        "font-size": "18px",
        "font-weight": "100",
        "top": "0px"
      });

      $(".spin", this).css({
        "width": "100%"
      });
    });
  }).blur(function() {
    $(".spin").css({
      "width": "0px"
    });

    if ($(this).val() === "") {
      $(this).parent(".input").each(function() {
        $("label", this).css({
          "line-height": "60px",
          "font-size": "24px",
          "font-weight": "300",
          "top": "10px"
        });
      });
    }
  });

  // TODO Get random movie poster, put it as the body background
  function randomID(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // console.log(randomID(0, 9999999));
  // getMovieDetails( randomID() );
})(jQuery);
