// MAIN SCRIPT FILE, WITH VANILLA TASTE

// Waiting for DOM to be fully loaded, similar to $(document).ready function
document.addEventListener('DOMContentLoaded', function() {

  // ALL DOM RELATED MODIFIER FUNCTION WILL GO HERE, MOSTLY ON TRAVERSING AND SEARCHING ELEMENT
  var _DOM = function() {
    var _dom = document;

    return {
      id: function(el) {
        return _dom.getElementById(el);
      },
      $: function(el) {
        return _dom.querySelector(el);
      },
      all: function(selector, callback) {
        [].forEach.call(_dom.querySelectorAll(selector), function(el) {
          return callback(el);
        });
      },
      create: function(selector) {
        return _dom.createElement(selector);
      }
    };
  }();

  // ALL AJAX RELATED FUNCTIONS CAN BE PUBLICLY CALLED THROUGH THIS OBJECT
  var _OMDB = function(appCtrl, _dom) {
    var request = new XMLHttpRequest(),
        _endpoint = '//www.omdbapi.com/?',
        _base = window.location.origin;

    return {
      getMovies: function(params, callback) {
        request.open('GET', _endpoint + params, true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            callback(request.responseText);
          } else {
            appCtrl.showEmptyError('Connection Error, please refresh.');
          }
        };
        request.send();
      },
      getMovieDetails: function(imdb_id, callback) {
        if ( ! imdb_id ) return ;
        var search_params = "i=" + imdb_id + "&type=movie&plot=full&tomatoes=true&r=json";

        request.open('GET', _endpoint + search_params, true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            callback(request.responseText);
          } else {
            appCtrl.showEmptyError('Connection Error, please refresh.');
          }
        };
        request.send();
      },
      getFavorites: function(callback) {
        request.open('GET', _base + '/favorites', true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            callback(request.responseText);
          } else {
            appCtrl.showEmptyError('Connection Error, please refresh.');
          }
        };
        request.send();
      },
      updateDeleteFavorite: function(type, favlink, oid, name) {
        var fav_param = "name=" + name + "&oid=" + oid;

        request.open(type, _base + '/favorites', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(fav_param);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            if (type == "DELETE" && 'true' === favlink.attr('data-in-favorite')) {
              _dom.$('#'+oid).fadeOut();
            }
          } else {
            appCtrl.showEmptyError('Connection Error, please refresh.');
          }
        };
      }
    };
  }(_SHARED, _DOM);

  // ALL APPLICATION SPECIFIC HELPER FUNCTIONS
  var _SHARED = function(_omdb, _dom) {
    // putting these three function outside the return function, so it's accessible for other public returned method

    // this function restart all the form state prior submitting a search
    this.resetForm = function() {
      _dom.$('form').reset();
      _dom.$('.input input').value = "";
      _dom.$('.input input').trigger('blur');
      _dom.$('.result-list').innerHTML = "";
      _dom.all('.paginator', function(paginator) {
        paginator.style.display = 'none';
      });
    };

    this.resetPagination = function(results, params) {
      var totalResultCount = results.totalResults,
          totalPages = Math.ceil(totalResultCount / 10),
          paginators, next_paginators, prev_paginators;

      // show pagination only if search result is more than 10 items
      // setting the parameter for pagination upon the total result count
      if(totalResultCount > 10) {
        _dom.all('.next', function(next) {
          next.removeAttribute('data-page');
          next.removeClass('disabled');
        });

        _dom.all('.previous', function(prev) {
          prev.attr('data-page', 1);
          prev.addClass('disabled');
        });

        _dom.all('.paginator', function(paginator) {
          paginator.fadeIn();
          paginator.attr('data-params', params);
          paginator.attr('data-current-page', 1);
          paginator.attr('data-max', totalPages);
          paginator.attr('data-max', totalPages);
        });
      } else {
        _dom.all('.paginator', function(paginator) {
          paginator.style.display = 'none';
        });
      }
    };

    this.listResults = function(results, inFavorite) {
      var resultSpinner = _dom.$('.spinner-wrapper'),
          movieTemplate = _dom.id('movielist-template').innerHTML,
          listObject = {},
          listsArr = [];

      var movieList, favLink, favStar, movieTitle, movieLink, detailSection;

      for (var i in results) {
        // create new list, but set it's child node to be the same like the template
        // this method is replicated for movie details as well
        movieList = _dom.create('li');
        movieList.innerHTML = movieTemplate;

        favLink = movieList.querySelector('input');
        favStar = movieList.querySelector('label');
        movieTitle = movieList.querySelector('h2');
        movieLink = movieList.querySelector('a');
        detailSection = movieList.querySelector('section');
        clonedSpinner = resultSpinner.cloneNode(true);

        listObject = {
          imdb_id: results[i].imdbID,
          title: results[i].Title,
          poster_url: results[i].Poster
        };

        // only adjusting node attributes that needed to be changed
        favStar.attr('for', 'fav' + i);

        favLink.id = 'fav' + i;
        favLink.attr('data-imdb', listObject.imdb_id);
        favLink.attr('data-movie-title', listObject.title);

        // this attribute is mainly for aesthetic purposes
        // fade out element if the the movie item is unfavorited under favorite list
        if (inFavorite) {
          favLink.attr('checked', true);
          favLink.attr('data-in-favorite', 'true');
        } else {
          favLink.attr('data-in-favorite', 'false');
        }

        movieLink.href = listObject.poster_url;
        movieLink.attr('data-imdb', listObject.imdb_id);
        movieLink.innerHTML = listObject.title;

        movieTitle.appendChild(movieLink);

        clonedSpinner.id = 'result-spinner-' + listObject.imdb_id;
        detailSection.appendChild(clonedSpinner);

        movieList.id = listObject.imdb_id;
        movieList.appendChild(favLink);
        movieList.appendChild(favStar);
        movieList.appendChild(movieTitle);
        movieList.appendChild(detailSection);

        // put all li element inside a list
        listsArr.push(movieList);
      }

      for (var list in listsArr) {
        // and adding each list into the result list container
        _dom.$('.result-list').appendChild(listsArr[list]);
      }

      // check the status of favorites of each movie results based on it imdb id
      _omdb.getFavorites(function(all_fav_in_data) {
        all_favs = JSON.parse(all_fav_in_data);

        for (var i in all_favs) {
          for (var j in listsArr) {
            if( listsArr[j].id === all_favs[i].oid ) _dom.$('#fav' + j).checked = true;
          }
        }
      });
    };

    // all functions under the return function can be called from other modules
    // this pattern is replicated from other modules
    return {
      // functions to follow the anchor of a hyperlink element
      jump: function(selector_id) {
        var top = _dom.id(selector_id).offsetTop; //Getting Y of target element
        window.scrollTo(0, top);
      },
      resetForm: this.resetForm,
      listResults: this.listResults,
      showEmptyError: function(message) {
        _dom.all('.alert-container .alert', function(el) {
          el.textContent = message;
        });

        _dom.$('.alert-container').fadeIn();
        this.resetForm();
      },
      showSearchResults: function(params, type) {
        _dom.$('#search-spinner').fadeIn();

        _omdb.getMovies(params, function(results) {
          results = JSON.parse(results);

          // if the result response from OMDB is empty, show error on the result list
          if ('True' === results.Response) {
            _dom.$('.result-list').innerHTML = "";
            if(type === 'search') this.resetPagination(results, params);
            this.listResults(results.Search, false);
          } else {
            _dom.$('.result-list').innerHTML = '<h2>' + results.Error + '</h2>';
          }

          _dom.$('.alert-container').fadeOut();
          _dom.$('#search-spinner').fade('out');
        });
      }
    };
  }(_OMDB, _DOM);

  // FORM Module, all interaction with the form will managed here
  (function($submit, formCtrl) {
    $submit.addEventListener('click', function(e) {
      e.preventDefault();

      // get request parameters from form
      var form = _DOM.$('form'),
          formData = serialize(form),
          formArr = serializeArray(form);

      // make sure the css doesn't flash 'active' (yellow)
      _DOM.$(".favorite").classList.remove('active');

      if (!formArr[0].value) {
        formCtrl.showEmptyError('Please enter your search keyword');
      } else {
        formCtrl.showSearchResults(formData, 'search');
      }
    }, false);
  })(_DOM.$('.submit'), _SHARED);

  // RESULT Module, all interaction with the result list will managed here
  (function($result, resultCtrl, _omdb) {
    function addMovieDetailsToSection(section, details) {
      var movieDetailTemplate = _DOM.id('moviedetail-template').innerHTML;
      section.innerHTML = movieDetailTemplate;

      // movie poster part
      var detail_container = section.querySelector('.media'),
          movie_poster = detail_container.querySelector('.media-left'),
          poster_link = movie_poster.querySelector('a'),
          poster_img = poster_link.querySelector('img');
      // movie copy part
      var movie_copy = section.querySelector('.media-body'),
          movie_heading = movie_copy.querySelector('h4'),
          movie_plot = movie_copy.querySelector('.plot'),
          movie_director = movie_copy.querySelector('.director'),
          movie_rating = movie_copy.querySelector('.rating'),
          movie_length = movie_copy.querySelector('.length'),
          movie_imdb_rating = movie_copy.querySelector('.imdb_rating');


      // customizing movie poster part
      if ('N/A' !== details.Poster) {
        poster_link.href = details.Poster;
        poster_img.attr('src', details.Poster);
      } else {
        poster_link.href = 'http://lorempixel.com/250/370';
        poster_img.attr('src', 'http://lorempixel.com/250/370');
      }

      // customizing movie copy part
      movie_heading.textContent = details.Year;
      movie_plot.textContent = details.Plot;
      movie_director.textContent = details.Director;
      movie_rating.textContent = details.Rated;
      movie_length.textContent = details.Runtime;
      movie_imdb_rating.textContent = details.imdbRating;

      section.appendChild(detail_container);
    }

    function hideOtherMovies() {
      [].forEach.call($result.querySelectorAll('section'), function(el) {
        el.style.display = 'none';
        el.style.opacity = 0;
      });
      [].forEach.call($result.querySelectorAll('.movie-link'), function(el) {
        el.removeClass('active');
      });
    }

    // what happened once a movie item is clicked
    $result.on('click', '.movie-link', function(e) {
      e.preventDefault();
      var this_link = e.target,
          imdb_id = e.target.attr('data-imdb'),
          movieSection = this_link.parents('li')[0].querySelector('section');

      if (! this_link.hasClass('active')) {
        // hide other movies sections once a movie link was clicked
        hideOtherMovies();

        // check if the section already has details section
        // if not, add the details into the section
        // if yes, dont add it in again
        if(0 === movieSection.querySelectorAll('.media').length)  {
          _DOM.$('#result-spinner-' + imdb_id).fadeIn();
          _omdb.getMovieDetails(imdb_id, function(details) {
            details = JSON.parse(details);
            addMovieDetailsToSection(movieSection, details);

            if (movieSection.querySelector('.spinner-wrapper')) {
              movieSection.querySelector('.spinner-wrapper').fadeOut();
            }
          });
        }

        movieSection.addClass('active');
        this_link.addClass('active');
        movieSection.fadeIn();

        resultCtrl.jump(imdb_id);
      }
    });

    // what happened once a favorite star is clicked
    $result.on('click', '.fav-link', function(e) {
      var star = e.target,
          imdb_id = star.attr('data-imdb'),
          title = star.attr('data-movie-title');

      if (star.checked) {
        _omdb.updateDeleteFavorite('POST', star, imdb_id, title);
      } else {
        _omdb.updateDeleteFavorite('DELETE', star, imdb_id, title);
      }
    });
  })(_DOM.$('.result-list'), _SHARED, _OMDB);

  // FAVORITE Module, all interaction once "My Favorites" is clicked
  (function($favorite, favCtrl, _omdb) {
    $favorite.addEventListener('click', function(e) {
      e.preventDefault();
      $favorite.addClass('active');

      var allFavs = [];

      _omdb.getFavorites(function(all_fav_in_data) {
        all_fav_in_data = JSON.parse(all_fav_in_data);

        for (var fav in all_fav_in_data) {
          allFavs.push({
            imdbID: all_fav_in_data[fav].oid,
            Title: all_fav_in_data[fav].name
          });
        }

        if (0 === allFavs.length) {
          favCtrl.showEmptyError('You have not liked any movie. Click on the star!');
        } else {
          _DOM.$('.alert-container').fadeOut();
          favCtrl.resetForm();
          favCtrl.listResults(allFavs, true);
        }
      });
    });
  })(_DOM.$('.favorite'), _SHARED, _OMDB);

  // when pagination button is clicked (next or previous)
  // a call is made again to oMDB api
  // and the pagination element is updated accordingly
  // not a core function, hence jquery is used
  (function($, paginator, paginatorCtrl) {
    var all_next = $('.next'),
        all_prev = $('.previous');

    paginator.on('click', '.change-page', function(e) {
      e.preventDefault();

      var maxPage = paginator.attr('data-max'),
          params = paginator.attr('data-params'),
          currentPage = parseInt(paginator.attr('data-current-page')),
          nextPage =
          ( 'undefined' === typeof( all_next.attr('data-page') ) ) ? currentPage + 1 : parseInt(all_next.attr('data-page')),
          prevPage = ( 1 < currentPage ) ? currentPage - 1 : currentPage;


      var pager_trigger = $(this),
          new_page = (pager_trigger.hasClass('next')) ? nextPage : prevPage;

      if(pager_trigger.hasClass('disabled')) return false;
      // $('.change-page').addClass('disabled');

      params = params + '&page=' + new_page;
      paginatorCtrl.showSearchResults(params);

      $('.change-page').removeClass('disabled');
      if(new_page == maxPage) all_next.addClass('disabled');
      if(new_page == 1) all_prev.addClass('disabled');

      paginator.attr('data-current-page', new_page);
      all_next.attr('data-page', new_page + 1);
      all_prev.attr('data-page', new_page - 1);
    });
  })(jQuery, jQuery('.paginator'), _SHARED);
});
