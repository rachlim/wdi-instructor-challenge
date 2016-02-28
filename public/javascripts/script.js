document.addEventListener('DOMContentLoaded', function() {
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
    var _dom = document,
        event = _dom.createEvent('HTMLEvents');

    this.$ = function(el) {
      // TODO: this part here needs to be refactored as well
      // if (!(this instanceof $)) {
      //   return new $(el);
      // }
      // this.el = document.querySelector(el);
      console.log();
      return _dom.querySelector(el);
    };

    return {
      $: this.$,
      all: function(selector) {
        return _dom.querySelectorAll(selector);
      },
      trigger: function(ev, selector) {
        var event = _dom.createEvent('HTMLEvents');
        event.initEvent(ev, true, false);
        [].forEach.call(
          this.all(selector), function(el) {
            el.dispatchEvent(event);
        });
      },
      // TODO: This fade function still buggy
      fade: function(selector, type, ms) {
        var isIn = type === 'in',
          opacity = isIn ? 1 : 0,
          interval = 500,
          duration = ms || 5000,
          gap = interval / duration;

        if(isIn) {
          this.$(selector).style.display = 'block';
          this.$(selector).style.opacity = opacity;
        }

        function func() {
          opacity = isIn ? opacity + gap : opacity - gap;
          this.$(selector).style.opacity = opacity;

          if(opacity <= 0) this.$(selector).style.display = 'none';
          if(opacity <= 0 || opacity >= 1) window.clearInterval(fading);
        }

        var fading = window.setInterval(func, interval);
      }
    };
  }();

  var _SHARED = function(_omdb, _dom) {
    this.resetForm = function() {
      _dom.$('form').reset();
      _dom.trigger('blur', '.input input');
      _dom.fade('.paginator', 'out');
      if( _dom.$('button.active') ) _dom.$('button.active').classList.remove('active');
    };

    this.listResults = function(results, inFavorite) {
      var list = [];
      var favLink, favStar, movieTitle, movieLink, detailSection, movieList;
      var resultSpinner = _dom.$('.spinner-wrapper');

      //TODO: Refactor this loop
      for (var i in results) {
        console.log(results[i]);
      }
    };

    return {
      resetForm: this.resetForm,
      listResults: this.listResults,
      // this function gets called to fill the error message placeholder
      showEmptyError: function(message) {
        [].forEach.call( _dom.all('.alert-container .alert'), function(el) {
          el.textContent = message;
        });

        _dom.fade('.alert-container', 'in') ;
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
  (function($selector, $resultCtrl) {
    $selector.addEventListener('click', function(e) {
      e.preventDefault();

      // get request parameters from form
      var form = _DOM.$('form'),
          formData = serialize(form),
          formArr = serializeArray(form);

      // make sure the css doesn't flash 'active' (yellow)
      _DOM.$(".favorite").classList.remove('active');
      // console.log(formData, formArr);

      if ( ! formArr[0].value ) {
        $resultCtrl.showEmptyError('Please enter your search keyword');
      } else {
        $resultCtrl.showSearchResults(formData, 'search');
      }

    }, false);
  })(_DOM.$('.submit'), _SHARED);
});
