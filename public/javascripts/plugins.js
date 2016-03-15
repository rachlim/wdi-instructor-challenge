// THIS FILE IS ONLY FOR STANDALONE JAVASCRIPT HELPER FUNCTIONS

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
// ALL PROTOTYPE FUNCTION FOR ELEMENT OBJECT TO MAKE IT EASIER TO MODIFY ELEMENT
// reference: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype

// combine both native set and getAttribute into a same function
Element.prototype.attr = function(name, value) {
  if (typeof value === "undefined") {
    return this.getAttribute(name);
  } else {
    return this.setAttribute(name, value);
  }
};

// Giving trigger handle to an event, reference: http://api.jquery.com/trigger/
Element.prototype.trigger = function(ev) {
  var event = document.createEvent('HTMLEvents');
  event.initEvent(ev, true, false);
  this.dispatchEvent(event);
};

// Checking if a class exist in a DOM element, reference: https://api.jquery.com/hasclass/
Element.prototype.hasClass = function(classname) {
  if (this.classList) {
    return this.classList.contains(classname);
  } else {
    return new RegExp('(^| )' + classname + '( |$)', 'gi').test(this.classname);
  }
};

// Adding a class to an element, reference: https://api.jquery.com/hasClass/
Element.prototype.addClass = function(className) {
  if (this.classList)
    this.classList.add(className);
  else
    this.className += ' ' + className;
};

// Adding a class to an element, reference: https://api.jquery.com/addClass/
Element.prototype.removeClass = function(className) {
  var el = this;

  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

// Observer for event on an element, even if the element is not yet created or modified
// reference: http://api.jquery.com/on/
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

// Traverse an element up to its parents, until it found a parent element with a given selector name or class
// reference: http://api.jquery.com/parents/
Element.prototype.parents = function(selector) {
  var parents = [],
      firstChar = '';

  if (selector) {
    firstChar = selector.charAt(0);
  }

  elem = this;

  // Get matches
  // basically this is a while loop, stops until it found a match
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

// A utilities function for fading out an element
// reference: http://api.jquery.com/on/
Element.prototype.fadeOut = function(speed) {
  var el = this;

  speed = speed || 20;
  el.style.opacity = 1;

  // recursion function that stops until the element's opacity is 0
  // if opacity is 0, hide the element
  (function fade() {
    if ((el.style.opacity-=0.1)<0.1) {
      el.style.display="none";
    } else {
      setTimeout(fade,speed);
    }
  })();
};

// A utilities function for fading in an element
// reference: http://api.jquery.com/on/
Element.prototype.fadeIn = function(speed) {
  var el = this;

  speed = speed || 20;
  el.style.opacity = 0;
  el.style.display = "block";

  // recursion function that stops until the element's opacity is 1
  (function fade() {
    var val = parseFloat(el.style.opacity);

    if (false === ((val += 0.1) > 1) ) {
      el.style.opacity = val;
      setTimeout(fade,speed);
    }
  })();
};

function serialize(form){if(!form||form.nodeName!=="FORM"){return; }var i,j,q=[];for(i=form.elements.length-1;i>=0;i=i-1){if(form.elements[i].name===""){continue;}switch(form.elements[i].nodeName){case"INPUT":switch(form.elements[i].type){case"text":case"hidden":case"password":case"button":case"reset":case"submit":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"checkbox":case"radio":if(form.elements[i].checked){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));}break;case"file":break;}break;case"TEXTAREA":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"SELECT":switch(form.elements[i].type){case"select-one":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"select-multiple":for(j=form.elements[i].options.length-1;j>=0;j=j-1){if(form.elements[i].options[j].selected){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].options[j].value));}}break;}break;case"BUTTON":switch(form.elements[i].type){case"reset":case"submit":case"button":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;}break;}}return q.join("&");}

var serializeArray = (function (slice) {
    return function (form) {
        //no form, no serialization
        if (form === null)
            return null;

        //get the form elements and convert to an array
        return slice.call(form.elements)
            .filter(function (element) {
                //remove disabled elements
                return !element.disabled;
            }).filter(function (element) {
                //remove unchecked checkboxes and radio buttons
                return !/^input$/i.test(element.tagName) || !/^(?:checkbox|radio)$/i.test(element.type) || element.checked;
            }).filter(function (element) {
                //remove <select multiple> elements with no values selected
                return !/^select$/i.test(element.tagName) || element.selectedOptions.length > 0;
            }).map(function (element) {
                switch (element.tagName.toLowerCase()) {
                    case 'checkbox':
                    case 'radio':
                        return {
                            name: element.name,
                            value: element.value === null ? 'on' : element.value
                        };
                    case 'select':
                        if (element.multiple) {
                            return {
                                name: element.name,
                                value: slice.call(element.selectedOptions)
                                    .map(function (option) {
                                        return option.value;
                                    })
                            };
                        }
                        return {
                            name: element.name,
                            value: element.value
                        };
                    default:
                        return {
                            name: element.name,
                            value: element.value || ''
                        };
                }
            });
    };
}(Array.prototype.slice));
