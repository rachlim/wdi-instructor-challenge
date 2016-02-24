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

function fadeOut(el){
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= 0.1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

// fade in

function fadeIn(el, display){
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if ( false === ((val += 0.1) > 1) ) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}
