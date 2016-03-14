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
  Element.prototype.fadeOut = function(speed) {
    var el = this;

    speed = speed || 20;
    el.style.opacity = 1;

    // console.log(el, 'fade out');

    (function fade() {
      if ((el.style.opacity-=0.1)<0.1) {
        el.style.display="none";
      } else {
        setTimeout(fade,speed);
      }
    })();
  };
  Element.prototype.fadeIn = function(speed) {
    var el = this;

    speed = speed || 20;
    el.style.opacity = 0;
    el.style.display = "block";

    // console.log(el, 'fade in');

    (function fade() {
      var val = parseFloat(el.style.opacity);

      if (false === ((val += 0.1) > 1) ) {
        el.style.opacity = val;
        setTimeout(fade,speed);
      }
    })();
  };

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
            if (type == "DELETE" && 'true' === favlink.getAttribute('data-in-favorite')) {
              _dom.$('#'+oid).fadeOut();
            }
          } else {
            appCtrl.showEmptyError('Connection Error, please refresh.');
          }
        };
      }
    };
  }(_SHARED, _DOM);

  var _SHARED = function(_omdb, _dom) {
    this.resetForm = function() {
      _dom.$('form').reset();
      _dom.$('.input input').value = "";
      _dom.$('.input input').trigger('blur');
      _dom.$('.result-list').innerHTML = "";
      _dom.all('.paginator', function(paginator) {
        paginator.style.display = 'none';
      });
    };

    this.listResults = function(results, inFavorite) {
      var resultSpinner = _dom.$('.spinner-wrapper'),
          movieTemplate = _dom.id('movielist-template').innerHTML,
          listObject = {},
          listsArr = [];

      var movieList, favLink, favStar, movieTitle, movieLink, detailSection;

      for (var i in results) {
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

        favStar.setAttribute('for', 'fav' + i);

        favLink.id = 'fav' + i;
        favLink.setAttribute('data-imdb', listObject.imdb_id);
        favLink.setAttribute('data-movie-title', listObject.title);

        if (inFavorite) {
          favLink.setAttribute('checked', true);
          favLink.setAttribute('data-in-favorite', 'true');
        } else {
          favLink.setAttribute('data-in-favorite', 'false');
        }

        movieLink.href = listObject.poster_url;
        movieLink.setAttribute('data-imdb', listObject.imdb_id);
        movieLink.innerHTML = listObject.title;

        movieTitle.appendChild(movieLink);

        clonedSpinner.id = 'result-spinner-' + listObject.imdb_id;
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

    this.resetPagination = function(results, params) {
      var totalResultCount = results.totalResults,
          totalPages = Math.ceil(totalResultCount / 10),
          paginators, next_paginators, prev_paginators;

      // show pagination only if search result is more than 10 items
      if(totalResultCount > 10) {
        _dom.all('.next', function(next) {
          next.removeAttribute('data-page');
          next.removeClass('disabled');
        });

        _dom.all('.previous', function(prev) {
          prev.setAttribute('data-page', 1);
          prev.addClass('disabled');
        });

        _dom.all('.paginator', function(paginator) {
          paginator.fadeIn();
          paginator.setAttribute('data-params', params);
          paginator.setAttribute('data-current-page', 1);
          paginator.setAttribute('data-max', totalPages);
          paginator.setAttribute('data-max', totalPages);
        });
      } else {
        _dom.all('.paginator', function(paginator) {
          paginator.style.display = 'none';
        });
      }
    };

    return {
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
        poster_img.setAttribute('src', details.Poster);
      } else {
        poster_link.href = 'http://lorempixel.com/250/370';
        poster_img.setAttribute('src', 'http://lorempixel.com/250/370');
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

    $result.on('click', '.movie-link', function(e) {
      e.preventDefault();
      var this_link = e.target,
          imdb_id = e.target.getAttribute('data-imdb'),
          movieSection = this_link.parents('li')[0].querySelector('section');

      if (! this_link.hasClass('active')) {
        hideOtherMovies();

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
