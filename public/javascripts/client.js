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

  $(".button").click(function(e) {
    var pX = e.pageX,
      pY = e.pageY,
      oX = parseInt($(this).offset().left),
      oY = parseInt($(this).offset().top);

    $(this).append('<span class="click-effect x-' + oX + ' y-' + oY + '" style="margin-left:' + (pX - oX) + 'px;margin-top:' + (pY - oY) + 'px;"></span>');
    $('.x-' + oX + '.y-' + oY + '').animate({
      "width": "500px",
      "height": "500px",
      "top": "-250px",
      "left": "-250px",

    }, 600);
    $("button", this).addClass('active');
  });

  // THIS PART HERE COVERS ALL DOM MANIPULATION FROM SEARCH MOVIES BASED ON KEYWORDS
  $('form').on('submit', function(event) {
    event.preventDefault();
    var form = $(this);
    var formData = form.serialize();
    var formArr = form.serializeArray();

    if (! formArr[0].value) {
      showEmptyError();
    } else {
      showResultsFlow(formData);
    }
  });

  function showEmptyError() {
    $('.alert-container').find('.alert').text('Please enter your search keyword');
    $('.alert-container').fadeIn();
    resetFlow();
  }

  function showResultsFlow(formData) {
    $('.spinner-wrapper').show();

    $.ajax({
      type: 'GET',
      url: __OMDB + formData
    }).done(function(results) {
      $('.alert-container').fadeOut();
      resetFlow();

      if ('True' == results.Response) {
        listResults(results);
        addPaginationIfExists(results);
      } else {
        resetFlow();
        $('.result-list').html('<h2>' + results.Error + '</h2>');
      }
    });
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
    var filmTitle, filmLink, detailSection, filmList;

    for (var i in results.Search) {
      filmLink = $('<a/>', {
                            class: 'film-link',
                            href: __BASE.origin + '/movies/' + results.Search[i].imdbID,
                            text: results.Search[i].Title,
                            'data-imdb' : results.Search[i].imdbID,
                          });
      filmTitle = $('<h2/>',{
                          html: filmLink
                      });

      detailSection = $('<section/>');
      filmList = $('<li/>', {
        html: filmTitle
      }).append(detailSection);

      list.push(filmList);
    }

    $('.result-list').append(list);
  }

  // TODO
  function addPaginationIfExists(results) {
    var total = results.TotalResults;
  }

  // THIS PART HERE COVERS ALL DOM MANIPULATION FROM GETTING DETAILS ON MOVIES
  $('.result-list').on('click', '.film-link', function(e) {
    e.preventDefault();
    var movie = $(this);
    var imdb_id = movie.data('imdb');

    getDetails(imdb_id, function(details) {
      var movieSection = movie.parents('li').find('section');
      console.log(details);
      hideOtherSections();
      showSection(movieSection, details);
    });
  });

  function hideOtherSections() {
    $('.result-list').find('section').empty();
  }

  function getDetails(imdb_id, callback) {
    // TODO: VALIDATE IF IMDB ID IS EMPTY

    var details;

    var search_params = "i=" + imdb_id + "&type=movie&r=json";
    $.ajax({
      type: 'GET',
      url: __OMDB + search_params,
      success: function(data) {
        details = data;
        callback(details);
      }
    });
  }

  function showSection(section, details) {
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

    detail_container.append(movie_poster).append(movie_copy);
    section.append(detail_container);
    section.fadeIn('slow');
  }
})($);
