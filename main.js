/*
 * Authing Lock v1.0.0 (https://authing.cn)
 * Copyright 2017-2018 Authing, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
*/

(function (global, factory) {
    // CommonJS and Node.js module support.
    if (typeof exports !== 'undefined') {
      // Support Node.js specific `module.exports` (which can be a function)
      if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = factory();
      }
      // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
      exports.tt = factory();
    }
    // Support browser
    else {
        global.AuthingLock = global.AuthingLock || factory();
    }
  }(this, function() {

    window.onload = function() {

        var loadBasicHTML = function() {
            var html = '';
            if(html) {
                document.body.innerHTML = html;
            }
        }

        var loadVue = function(onload) {
            var vueScript = document.createElement('script');
            vueScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/vue');
            vueScript.onload = onload;
            document.body.appendChild(vueScript);
        }

        loadBasicHTML();

        loadVue(function() {
            var authingLockApp = new Vue({
                el: '#app',
                data: {
                  message: 'Hello Vue!'
                }
            });
        });

    }
    
    return {
        hello: 'Authing Lock'
    }
  }));
  