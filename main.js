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
      exports = module.exports = factory()
    }
    // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
    exports.tt = factory()
  }
  // Support browser
  else {
    global.AuthingLock = global.AuthingLock || factory()
  }
}(this, function () {

  window.onload = function () {
    console.log('test')
    var loadBasicHTML = function () {
      var html = ''
      if (html) {
        document.body.innerHTML = html
      }
    }

    var loadVue = function (onload) {
      var vueScript = document.createElement('script')
      vueScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/vue')
      vueScript.onload = onload
      document.body.appendChild(vueScript)
    }

    loadBasicHTML()

    loadVue(function () {
      var authingLockApp = new Vue({
        el: '#app',
        data: {
          message: 'Hello Vue!',

          forgetPasswordVisible: false,
          loginVisible: true,
          oauthVisible: false,
          scanCodeVisible: false,
          signUpVisible: false

        },
        methods: {
          gotoLogin: function gotoLogin() {
            authingLockApp.forgetPasswordVisible = false
            authingLockApp.oauthVisible = false
            authingLockApp.scanCodeVisible = false
            authingLockApp.signUpVisible = false
            authingLockApp.loginVisible = true
          },
          gotoSignUp: function gotoSignUp() {
            authingLockApp.loginVisible = false
            authingLockApp.forgetPasswordVisible = false
            authingLockApp.oauthVisible = false
            authingLockApp.scanCodeVisible = false
            authingLockApp.signUpVisible = true
          },
          gotoForgetPassword: function gotoForgetPassword() {
            authingLockApp.loginVisible = false
            authingLockApp.oauthVisible = false
            authingLockApp.scanCodeVisible = false
            authingLockApp.signUpVisible = false
            authingLockApp.forgetPasswordVisible = true
          },

          handleSignUp: function handleSignUp() {
            console.log('handleSignUp')
          },
          handleLogin: function handleLogin() {
            console.log('handleLogin')

          },
          handleOauthLogin: function handleOauthLogin() {
            console.log('handleOauthLogin')

          },
          handleForgetPassword: function handleForgetPassword() {
            console.log('handleForgetPassword')
          },
        }
      })
    })

  }

  return {
    hello: 'Authing Lock'
  }
}))
  