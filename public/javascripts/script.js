document.addEventListener('DOMContentLoaded', function() {
  var DOM = document,
      SHARED = {
        $: function(el) {
          // if (!(this instanceof $)) {
          //   return new $(el);
          // }
          // this.el = document.querySelector(el);
          return document.querySelector(el);
        },
        all: function(selector) {
          return DOM.querySelectorAll(selector);
        },
        hide: function(el) {

        }
      };

  // FORM Module, all interaction with the form will happen here
  (function($selector) {
    $selector.addEventListener('click', function(e) {
      e.preventDefault();

      // get request parameters from form
      var form = SHARED.$('form'),
        formData = serialize(form),
        formArr = serializeArray(form);

      // make sure the css doesn't flash 'active' (yellow)
      SHARED.$(".favorite").classList.remove('active');

      console.log(formData, formArr);

      if ( ! formArr[0].value ) {
        console.log('call error module');
        showEmptyError('Please enter your search keyword');
      } else {
        console.log('call results module');
        // showSearchResults(formData);
      }

    }, false);
  })(SHARED.$('.submit'));

  // this function gets called to fill the error message placeholder
  function showEmptyError(message) {
    // SHARED.$('.paginator').hide();

    [].forEach.call( SHARED.all('.alert-container .alert'), function(el) {
      el.textContent = message;
    });

    fadeIn(SHARED.$('.alert-container'))  ;

    // resetFlow();
  }

});
