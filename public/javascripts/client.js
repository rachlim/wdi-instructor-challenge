// GLOBAL VAR
var __OMDB = '//www.omdbapi.com/?';
var __BASE = window.location;

(function() {
  // THIS PART HERE COVERS ALL DOM MANIPULATION FOR AESTHETIC PURPOSES
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

  // THIS PART HERE COVERS ALL SEARCH MOVIE FLOW
  $(".submit").click(function(e) {
    e.preventDefault();

    var form = $('form');
    var formData = form.serialize();
    var formArr = form.serializeArray();

    if (! formArr[0].value) {
      showEmptyError('Please enter your search keyword');
    } else {
      showSearchResults(formData);
    }
  });

  function showEmptyError(message) {
    $('.alert-container').find('.alert').text(message);
    $('.alert-container').fadeIn();
    resetFlow();
  }

  function showSearchResults(formData) {
    $('.spinner-wrapper').show();
    getMoviesFlow('search', formData);
  }

  function resetFlow() {
    $('.result-list').empty();
    $('form').trigger('reset');
    $('button.active').removeClass('active');
    $('span.click-effect').remove();
    $(".input input").trigger('blur');
    $('.spinner-wrapper').fadeOut('slow');
  }

  function listResults(results) {
    var list = [];
    var movieTitle, movieLink, detailSection, movieList;

    //TODO: Refactor this loop
    for (var i in results) {
      favLink = $('<input/>', {
                            id: 'fav' + i,
                            class: 'hide fav-link',
                            type: 'checkbox',
                            'data-imdb' : results[i].imdbID,
                            'data-movie-title' : results[i].Title,
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
        html: movieTitle,
        id: results[i].imdbID
      }).append(detailSection, favLink, favStar);

      list.push(movieList);
    }

    $('.result-list').append(list);
  }

  function checkFavStatus() {
    var all_fav_links = $('.fav-link');
    var all_fav_in_data = [];

    getFavorites(function(favsData) {
      all_fav_in_data = favsData;

      all_fav_links.each(function(k, favLink) {
        var this_fav_link = $(favLink);
        var fav_imdb_id = this_fav_link.data('imdb');

        for (var i in all_fav_in_data) {
          if(fav_imdb_id == all_fav_in_data[i].oid) this_fav_link.attr('checked', true);
        }
      });
    });
  }

  // TODO PAGINATION FOR RESULTS
  function handlePagination(results, params) {
    var totalResultCount = results.totalResults;

    if(totalResultCount > 10) {
      $('.paginator')
        .show()
        .data('params', params);
        // .find('.previous').addClass('disabled');
    }
  }

  $('.paginator').on('click', '.next', function(e) {
    e.preventDefault();
    var next_link = $(this),
        prev_link = $('.previous'),
        currentPage = next_link.data('page'),
        nextPage = (! currentPage) ? 2 : currentPage + 1,
        params = $('.paginator').data('params') + '&page=' + nextPage;

    prev_link.data('page', currentPage - 1);
    next_link.data('page', nextPage);
    getMoviesFlow('pagination', params);
  });

  $('.paginator').on('click', '.previous', function(e) {
    e.preventDefault();
    var prev_link = $(this),
        currentPage = prev_link.data('page'),
        prevPage = currentPage - 1;
        params = $('.paginator').data('params') + '&page=' + prevPage;

    prev_link.data('page', prevPage);
    getMoviesFlow('pagination', params);
  });

  // THIS PART HERE COVERS ALL DOM MANIPULATION FROM GETTING DETAILS ON MOVIES
  $('.result-list').on('click', '.movie-link', function(e) {
    e.preventDefault();
    var movie = $(this);
    var imdb_id = movie.data('imdb');

    getMovieDetails(imdb_id, function(details) {
      var movieSection = movie.parents('li').find('section');
      hideOtherMovies();
      showMovieDetails(movieSection, details);
    });
  });

  function hideOtherMovies() {
    $('.result-list').find('section').empty();
  }

  function showMovieDetails(section, details) {
    //TODO REFACTOR THIS APPEND ZILLA
    var detail_container = $('<div class="media" />');
    var movie_poster = $('<div class="media-left" />');
    var poster_link = $('<a href="' + details.Poster+ '" />');
    var poster_url = $('<img width="250" class="media-object" src="' + details.Poster+ '" />');
    poster_url.appendTo(poster_link);
    poster_link.appendTo(movie_poster);

    var movie_copy = $('<div class="media-body" />');
    var movie_heading = $('<h4 class="media-heading">' + details.Year + '</h4>');
    var movie_plot = $('<p class="plot" />').text(details.Plot);
    var movie_director = $('<p class="director" />').text('Director: ' + details.Director);
    var movie_rating = $('<p class="rating" />').text('Rating: ' + details.Rated);
    var movie_length = $('<p class="length" />').text('Runtime: ' + details.Runtime);
    var movie_imdb_rating = $('<p class="imdb_rating" />').text('iMDB Rating: ' + details.imdbRating);

    movie_copy.append(movie_plot)
              .append(movie_director)
              .append(movie_director)
              .append(movie_rating)
              .append(movie_length)
              .append(movie_imdb_rating)
              .prepend(movie_heading);

    detail_container.append(movie_poster, movie_copy);
    section.append(detail_container);
    section.fadeIn('slow');
  }

  // THIS PART HERE COVERS ALL EVENT ON CLICKING FAVORITE FOR A MOVIE
  $(".favorite").click(function(e) {
    e.preventDefault();

    var allFavs = [];

    getFavorites(function(all_fav_in_data) {
      for (var fav in all_fav_in_data) {
        allFavs.push({
          imdbID: all_fav_in_data[fav].oid,
          Title: all_fav_in_data[fav].name
        });
      }

      $('.paginator').hide();

      if (0 === allFavs.length) {
        showEmptyError('You have not liked any movie. Click on the star!');
      } else {
        resetFlow();
        listResults(allFavs);
        checkFavStatus();
      }
    });
  });

  $('.result-list').on('click', '.fav-link', function() {
    var star = $(this);
    var imdb_id = star.data('imdb');
    var title = star.data('movie-title');

    if (star.is(":checked")) {
      updateDeleteFavorite('POST', imdb_id, title);
    } else {
      updateDeleteFavorite('DELETE', imdb_id, title);
    }
  });

  // SHARED FUNCTIONS
  function getMoviesFlow(type, params) {
    getMovies(params, function(results) {
      $('.alert-container').fadeOut();
      resetFlow();

      if (results.Search) {
        if ('True' == results.Response) {
          listResults(results.Search);
          checkFavStatus();
          if(type === 'search') handlePagination(results, params);
        } else {
          resetFlow();
          $('.result-list').html('<h2>' + results.Error + '</h2>');
        }
      } else {
        $('.next').addClass('disabled');
      }
    });
  }

  function getMovies(params, callback) {
    console.log(params);

    $.ajax({
      type: 'GET',
      url: __OMDB + params
    }).done(function(results) {
      callback(results);
    });
  }

  function getMovieDetails(imdb_id, callback) {
    // TODO: VALIDATE IF IMDB ID IS EMPTY
    var search_params = "i=" + imdb_id + "&type=movie&r=json";

    $.ajax({
      type: 'GET',
      url: __OMDB + search_params,
      success: function(details) {
        callback(details);
      }
    });
  }

  function getFavorites(callback) {
    $.ajax({
      type: 'GET',
      url: __BASE + 'favorites',
      success: function(favorites) {
        callback(favorites);
      }
    });
  }

  function updateDeleteFavorite(type, oid, name) {
    $.ajax({
      type: type,
      url: __BASE + 'favorites',
      data: {
        name: name,
        oid: oid
      },
      success: function(data) {
        // TODO: do sth after post favorite?

        if (type == "DELETE") {
          $('#'+oid).fadeOut('slow');
        }
      }
    });
  }
})($);
