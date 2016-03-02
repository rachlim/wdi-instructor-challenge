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


  var _OMDB = function() {
    var request = new XMLHttpRequest(),
      _endpoint = '//www.omdbapi.com/?';

    return {
      getMovies: function(params, callback) {
        request.open('GET', _endpoint + params, true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            callback(request.responseText);
          }
        };
        request.send();
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
      },
      // TODO: This fade function still buggy
      fade: function(selector, type, ms) {
        var isIn = type === 'in',
          opacity = isIn ? 1 : 0,
          interval = 500,
          duration = ms || 5000,
          gap = interval / duration;

        if (isIn) {
          this.$(selector).style.display = 'block';
          this.$(selector).style.opacity = opacity;
        }

        function func() {
          opacity = isIn ? opacity + gap : opacity - gap;
          this.$(selector).style.opacity = opacity;

          if (opacity <= 0) this.$(selector).style.display = 'none';
          if (opacity <= 0 || opacity >= 1) window.clearInterval(fading);
        }

        var fading = window.setInterval(func, interval);
      }
    };
  }();

  var _SHARED = function(_omdb, _dom) {
    this.resetForm = function() {
      _dom.$('form').reset();
      _dom.$('.input input').trigger('blur');
      _dom.fade('.paginator', 'out');
      if (_dom.$('button.active')) _dom.$('button.active').classList.remove('active');
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
        favLink.setAttribute('data-in-favorite', 'false');

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
    };

    return {
      resetForm: this.resetForm,
      listResults: this.listResults,
      // this function gets called to fill the error message placeholder
      showEmptyError: function(message) {
        _dom.all('.alert-container .alert', function(el) {
          el.textContent = message;
        });

        _dom.fade('.alert-container', 'in');
        this.resetForm();
      },
      showSearchResults: function(params, type) {
        _dom.fade('#search-spinner', 'in');

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
            _dom.$('.result-list').innerHTML = '<h2>' + results_json.Error + '</h2>';
          }

          _dom.fade('.alert-container', 'out');
          _dom.fade('#search-spinner', 'out');
        });
      }
    };
  }(_OMDB, _DOM);

  // FORM Module, all interaction with the form will happen here
  (function($selector, formCtrl) {
    $selector.addEventListener('click', function(e) {
      e.preventDefault();

      // get request parameters from form
      var form = _DOM.$('form'),
        formData = serialize(form),
        formArr = serializeArray(form);

      // make sure the css doesn't flash 'active' (yellow)
      _DOM.$(".favorite").classList.remove('active');
      // console.log(formData, formArr);

      if (!formArr[0].value) {
        formCtrl.showEmptyError('Please enter your search keyword');
      } else {
        formCtrl.showSearchResults(formData, 'search');
      }

    }, false);
  })(_DOM.$('.submit'), _SHARED);

  // RESULT Module, all interaction with the result list will happen here
  (function($result, resultCtrl) {
    $result.on('click', '.movie-link', function(e) {
      e.preventDefault();
      var this_link = e.target,
        imdb_id = e.target.getAttribute('data-imdb');

      if (!this_link.hasClass('active')) {
        console.log('get movie details');

        var movieSection = this_link.parents('li');

        console.log(movieSection);
      }

      console.log(e.target, imdb_id);
    });

  })(_DOM.$('.result-list'), _SHARED);
});
