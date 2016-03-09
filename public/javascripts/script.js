document.addEventListener('DOMContentLoaded', function() {
  Element.prototype.attr = function(name, value) {
    if (typeof value === "undefined") {
      return this.getAttribute(name);
    } else {
      return this.setAttribute(name, value);
    }
  };
  Element.prototype.trigger = function(ev) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(ev, true, false);
    this.dispatchEvent(event);
  };
  Element.prototype.hasClass = function(classname) {
    if (this.classList) {
      return this.classList.contains(classname);
    } else {
      return new RegExp('(^| )' + classname + '( |$)', 'gi').test(this.classname);
    }
  };
  Element.prototype.addClass = function(className) {
    if (this.classList)
      this.classList.add(className);
    else
      this.className += ' ' + className;
  };
  Element.prototype.removeClass = function(className) {
    var el = this;

    if (el.classList) {
      el.classList.remove(className);
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  };
  Element.prototype.on = function(eventName, childSelector, callback) {
    var element = this;

    element.addEventListener(eventName, function(event) {
      var possibleTargets = element.querySelectorAll(childSelector);
      var target = event.target;

      for (var i = 0, l = possibleTargets.length; i < l; i++) {
        var el = target;
        var p = possibleTargets[i];

        while (el && el !== element) {
          if (el === p) {
            return callback.call(p, event);
          }

          el = el.parentNode;
        }
      }
    }, false);
  };
  Element.prototype.parents = function(selector) {
    var parents = [],
        firstChar = '';

    if (selector) {
      firstChar = selector.charAt(0);
    }

    elem = this;

    // Get matches
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
      if (selector) {
        // If selector is a class
        if (firstChar === '.') {
          if (elem.classList.contains(selector.substr(1))) {
            parents.push(elem);
          }
        }

        // If selector is an ID
        if (firstChar === '#') {
          if (elem.id === selector.substr(1)) {
            parents.push(elem);
          }
        }

        // If selector is a data attribute
        if (firstChar === '[') {
          if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
            parents.push(elem);
          }
        }

        // If selector is a tag
        if (elem.tagName.toLowerCase() === selector) {
          parents.push(elem);
        }

      } else {
        parents.push(elem);
      }
    }

    // Return parents if any exist
    if (parents.length === 0) {
      return null;
    } else {
      return parents;
    }
  };
  Element.prototype.fade = function(type, ms) {
    var isIn = type === 'in',
      opacity = isIn ? 1 : 0,
      interval = 500,
      duration = ms || 5000,
      gap = interval / duration,
      element = this;

    if (isIn) {
      element.style.display = 'block';
      element.style.opacity = opacity;
    }

    function func() {
      opacity = isIn ? opacity + gap : opacity - gap;
      element.style.opacity = opacity;

      if (opacity <= 0) element.style.display = 'none';
      if (opacity <= 0 || opacity >= 1) window.clearInterval(fading);
    }

    var fading = window.setInterval(func, interval);
  };

  var _OMDB = function() {
    var request = new XMLHttpRequest(),
        _endpoint = '//www.omdbapi.com/?',
        _base = window.location.origin;

    return {
      getMovies: function(params, callback) {
        request.open('GET', _endpoint + params, true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            callback(request.responseText);
          }
        };
        request.send();
      },
      getMovieDetails: function(imdb_id, callback) {
        // TODO: VALIDATE IF IMDB ID IS EMPTY
        if ( ! imdb_id ) return ;

        var search_params = "i=" + imdb_id + "&type=movie&plot=full&tomatoes=true&r=json";

        request.open('GET', _endpoint + search_params, true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            callback(request.responseText);
          }

          //TODO: do something when there's error
        };
        request.send();
      },
      getFavorites: function(callback) {
        request.open('GET', _base + '/favorites', true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            callback(request.responseText);
          }

          //TODO: do something when there's error
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
            if (type == "DELETE" && favlink.getAttribute('data-in-favorite')) {
              _DOM.$('#'+oid).fade('out');
            }
          }

          //TODO: do something when there's error
        };
      }
    };
  }();

  var _DOM = function() {
    var _dom = document;

    this.$ = function(el) {
      return _dom.querySelector(el);
    };

    return {
      $: this.$,
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

  var _SHARED = function(_omdb, _dom) {
    this.resetForm = function() {
      _dom.$('form').reset();
      _dom.$('.input input').trigger('blur');
      _dom.$('.paginator').fade('out');
      _dom.$('.result-list').innerHTML = "";
      // if (_dom.$('button.active')) _dom.$('button.active').classList.remove('active');
    };

    this.listResults = function(results, inFavorite) {
      var resultSpinner = _dom.$('.spinner-wrapper'),
          listObject = {},
          listsArr = [];

      for (var i in results) {
        // TODO: refactor this, to clone if a same node already exists
        var movieList = _dom.create('li'),
          favLink = _dom.create('input'),
          favStar = _dom.create('label'),
          movieTitle = _dom.create('h2'),
          movieLink = _dom.create('a'),
          detailSection = _dom.create('section'),
          clonedSpinner = resultSpinner.cloneNode(true);

        listObject = {
          imdb_id: results[i].imdbID,
          title: results[i].Title
        };

        favLink.id = 'fav' + i;
        favLink.type = 'checkbox';
        favLink.setAttribute('class', 'hide fav-link');
        favLink.setAttribute('data-imdb', listObject.imdb_id);
        favLink.setAttribute('data-movie-title', listObject.title);

        if (inFavorite) {
          favLink.setAttribute('checked', true);
          favLink.setAttribute('data-in-favorite', 'true');
        } else {
          favLink.setAttribute('data-in-favorite', 'false');
        }

        favStar.setAttribute('aria-hidden', 'true');
        favStar.setAttribute('data-icon', '★');
        favStar.setAttribute('for', favLink.id);

        movieLink.setAttribute('class', 'movie-link');
        movieLink.href = "#";
        movieLink.setAttribute('data-imdb', listObject.imdb_id);
        movieLink.innerHTML = listObject.title;

        movieTitle.appendChild(movieLink);

        clonedSpinner.id = 'result-spinner-' + listObject.imdb_id;
        clonedSpinner.class = 'search-spinner';
        detailSection.appendChild(clonedSpinner);

        movieList.id = listObject.imdb_id;
        movieList.appendChild(favLink);
        movieList.appendChild(favStar);
        movieList.appendChild(movieTitle);
        movieList.appendChild(detailSection);

        listsArr.push(movieList);
      }

      for (var list in listsArr) {
        _dom.$('.result-list').appendChild(listsArr[list]);
      }

      _omdb.getFavorites(function(all_fav_in_data) {
        all_favs = JSON.parse(all_fav_in_data);

        for (var i in all_favs) {
          for (var j in listsArr) {
            if( listsArr[j].id === all_favs[i].oid ) _dom.$('#fav' + j).checked = true;
          }
        }
      });
    };

    return {
      resetForm: this.resetForm,
      listResults: this.listResults,
      // this function gets called to fill the error message placeholder
      showEmptyError: function(message) {
        _dom.all('.alert-container .alert', function(el) {
          el.textContent = message;
        });

        _dom.$('.alert-container').fade('in');
        this.resetForm();
      },
      showSearchResults: function(params, type) {
        _dom.$('#search-spinner').fade('in');

        _omdb.getMovies(params, function(results) {
          this.resetForm();
          results = JSON.parse(results);

          if ('True' === results.Response) {
            this.listResults(results.Search, false);

            // checkFavStatus();
            //
            // //if the trigger for this function comes from "search"
            // //reset back all the pagination
            // if(type === 'search') {
            //   resetPagination(results, params);
            // }
          } else {
            _dom.$('.result-list').innerHTML = '<h2>' + results.Error + '</h2>';
          }

          _dom.$('.alert-container').fade('out');
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
      var detail_container = _DOM.create('div'),
          movie_poster = _DOM.create('div'),
          poster_link = _DOM.create('a'),
          poster_img = _DOM.create('img');

      // movie poster part
      movie_poster.setAttribute('class', 'media-left');
      poster_img.class = 'media-object';
      poster_img.setAttribute('width', '250');

      if ('N/A' !== details.Poster) {
        poster_link.href = details.Poster;
        poster_img.setAttribute('src', details.Poster);
      } else {
        poster_link.href = 'http://lorempixel.com/250/370';
        poster_img.setAttribute('src', 'http://lorempixel.com/250/370');
      }

      poster_link.appendChild(poster_img);
      movie_poster.appendChild(poster_link);

      // movie copy part
      var movie_copy = _DOM.create('div');
      var movie_heading = _DOM.create('h4');
      var movie_plot = _DOM.create('p');
      var movie_director = _DOM.create('h5');
      var movie_rating = _DOM.create('h5');
      var movie_length = _DOM.create('h5');
      var movie_imdb_rating = _DOM.create('h5');

      movie_copy.setAttribute('class', 'media-body');
      movie_heading.setAttribute('class', 'media-heading');
      movie_heading.textContent = details.Year;
      movie_plot.setAttribute('class', 'plot');
      movie_plot.textContent = details.Plot;
      movie_director.setAttribute('class', 'director');
      movie_director.textContent = 'Director: ' + details.Director;
      movie_rating.setAttribute('class', 'rating');
      movie_rating.textContent = 'Rating: ' + details.Rated;
      movie_length.setAttribute('class', 'length');
      movie_length.textContent = 'Runtime: ' + details.Runtime;
      movie_imdb_rating.setAttribute('class', 'imdb_rating');
      movie_imdb_rating.textContent = 'iMDB Rating: ' + details.imdbRating;

      movie_copy.appendChild(movie_heading);
      movie_copy.appendChild(movie_plot);
      movie_copy.appendChild(movie_director);
      movie_copy.appendChild(movie_director);
      movie_copy.appendChild(movie_rating);
      movie_copy.appendChild(movie_length);
      movie_copy.appendChild(movie_imdb_rating);
      // movie_heading.appendChild(movie_copy);

      movie_poster.setAttribute('class', 'media-left');
      movie_copy.setAttribute('class', 'media-body');

      detail_container.setAttribute('class', 'media');
      detail_container.appendChild(movie_poster);
      detail_container.appendChild(movie_copy);

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

    $result.on('click', '.movie-link', function(e) {
      e.preventDefault();
      var this_link = e.target,
          imdb_id = e.target.getAttribute('data-imdb'),
          movieSection = this_link.parents('li')[0].querySelector('section');

      if (! this_link.hasClass('active')) {
        hideOtherMovies();

        if(0 === movieSection.querySelectorAll('.media').length)  {
          _DOM.$('#result-spinner-' + imdb_id).fade('in');
          _omdb.getMovieDetails(imdb_id, function(details) {
            details = JSON.parse(details);
            addMovieDetailsToSection(movieSection, details);
            movieSection.querySelector('.spinner-wrapper').fade('out');
          });
        }

        movieSection.addClass('active');
        this_link.addClass('active');
        movieSection.fade('in');
      }
    });

    $result.on('click', '.fav-link', function(e) {
        var star = e.target,
            imdb_id = star.getAttribute('data-imdb'),
            title = star.getAttribute('data-movie-title');

        if (star.checked) {
          _omdb.updateDeleteFavorite('POST', star, imdb_id, title);
        } else {
          _omdb.updateDeleteFavorite('DELETE', star, imdb_id, title);
        }
    });
  })(_DOM.$('.result-list'), _SHARED, _OMDB);

  // FAVORITE Module, all interaction with the favorite button will managed here
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
          _DOM.$('.alert-container').fade('out');
          favCtrl.resetForm();
          favCtrl.listResults(allFavs, true);
        }
      });
    });
  })(_DOM.$('.favorite'), _SHARED, _OMDB);
});
