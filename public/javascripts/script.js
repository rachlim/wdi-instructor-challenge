document.addEventListener('DOMContentLoaded', function() {
  var _DOM = document,
      _OMDB = function() {
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
      }(),
      _SHARED = function(omdb) {
        this.resetFlow = function() {
          if( this.$('button.active') ) this.$('button.active').classList.remove('active');
          this.$('.result-list').innerHTML = '';
          // this.$('form').trigger('reset');
          // this.$(".input input").trigger('blur');

          fadeOut($('#search-spinner'));
        };

        this.$ = function(el) {
          // if (!(this instanceof $)) {
          //   return new $(el);
          // }
          // this.el = document.querySelector(el);
          return _DOM.querySelector(el);
        };

        return {
          $: this.$,
          all: function(selector) {
            return _DOM.querySelectorAll(selector);
          },
          hide: function(el) {

          },
          getMoviesFlow: function(params, type) {
            omdb.getMovies(params, function(results) {
              fadeOut(this.$('.alert-container'));
              resetFlow();
            });
          },

        };
      }(_OMDB);

  // FORM Module, all interaction with the form will happen here
  (function($selector) {
    $selector.addEventListener('click', function(e) {
      e.preventDefault();

      // get request parameters from form
      var form = _SHARED.$('form'),
          formData = serialize(form),
          formArr = serializeArray(form);

      // make sure the css doesn't flash 'active' (yellow)
      _SHARED.$(".favorite").classList.remove('active');
      // console.log(formData, formArr);

      if ( ! formArr[0].value ) {
        showEmptyError('Please enter your search keyword');
      } else {
        showSearchResults(formData);
      }

    }, false);
  })(_SHARED.$('.submit'));

  // this function gets called to fill the error message placeholder
  function showEmptyError(message) {
    // _SHARED.$('.paginator').hide();

    [].forEach.call( _SHARED.all('.alert-container .alert'), function(el) {
      el.textContent = message;
    });

    fadeIn(_SHARED.$('.alert-container'))  ;

    // resetFlow();
  }

  function showSearchResults(formData) {
    fadeIn(_SHARED.$('#search-spinner'));
    _SHARED.getMoviesFlow(formData, 'search');
  }

});
