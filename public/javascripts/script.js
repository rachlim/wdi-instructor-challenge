document.addEventListener('DOMContentLoaded', function() {
  var _DOM = function() {
    var _dom = document,
        event = _dom.createEvent('HTMLEvents');

    this.$ = function(el) {
      // if (!(this instanceof $)) {
      //   return new $(el);
      // }
      // this.el = document.querySelector(el);
      return _dom.querySelector(el);
    };

    return {
      $: this.$,
      all: function(selector) {
        return _dom.querySelectorAll(selector);
      },
      trigger: function(evt, el) {
        event.initEvent(evt, true, false);
        this.$(el).dispatchEvent(event);
      }
    };
  }();

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

  var _SHARED = function(omdb) {
    this.resetFlow = function() {
      this.$('.result-list').innerHTML = '';
      if( this.$('button.active') ) this.$('button.active').classList.remove('active');
      _DOM.trigger('reset', 'form');
      _DOM.trigger('blur', '.input input');

      fadeOut(this.$('#search-spinner'));
    };

    this.listResults = function(results, inFavorite) {
      console.log('list results');
    };

    return {
      getMoviesFlow: function(params, type) {
        omdb.getMovies(params, function(results) {
          console.log(results);

          fadeOut(this.$('.alert-container'));
          this.resetFlow();

          var results_json = JSON.parse(results);

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
            fadeOut(this.$('.paginator'));
            this.$('.result-list').innerHTML = '<h2>' + results_json.Error + '</h2>';
          }
        });
      }
    };
  }(_OMDB);

  // FORM Module, all interaction with the form will happen here
  (function($selector) {
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
        showEmptyError('Please enter your search keyword');
      } else {
        showSearchResults(formData);
      }

    }, false);
  })(_DOM.$('.submit'));

  // this function gets called to fill the error message placeholder
  function showEmptyError(message) {
    // _DOM.$('.paginator').hide();

    [].forEach.call( _DOM.all('.alert-container .alert'), function(el) {
      el.textContent = message;
    });

    fadeIn(_DOM.$('.alert-container'))  ;

    // resetFlow();
  }

  function showSearchResults(formData) {
    fadeIn(_DOM.$('#search-spinner'));
    _SHARED.getMoviesFlow(formData, 'search');
  }

});
