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
  var emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/

  function removeAnimation(className) {
    document.getElementById(className).classList.remove('animated')
    document.getElementById(className).classList.remove('shake')
  }

  function removeRedLine(className) {
    document.getElementById(className).classList.remove('err-hint')
  }

  function addRedLine(className) {
    document.getElementById(className).classList.add('err-hint')
  }

  function addAnimation(className) {
    document.getElementById(className).classList.add('animated')
    document.getElementById(className).classList.add('shake')
    document.getElementById(className).classList.add('err-hint')
  }


  window.onload = function () {
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

    var auth = new Authing({
      clientId: '5a9fa26cf8635a000185528c',
      secret: '427e24d3b7e289ae9469ab6724dc7ff0'
    })

    auth.then(function (validAuth) {
      loadVue(function () {
        var authingLockApp = new Vue({
          el: '#app',
          data: {
            errMsg: '',
            successMsg: '',
            warnMsg: '',
            successVisible: false,
            errVisible: false,
            warnVisible: false,

            pageVisible: {
              wxQRCodeVisible: false,
              forgetPasswordVisible: false,
              loginVisible: false,
              oauthVisible: false,
              signUpVisible: false,
              verifyCodeVisible: false,
              forgetPasswordVerifyCodeVisible: false,
              forgetPasswordNewPasswordVisible: false,
              forgetPasswordSendEmailVisible: false,
            },

            pageStack: [],

            OAuthList: [],

            verifyCodeUrl: '',

            signUpForm: {
              username: '',
              password: '',
              email: '',
              rePassword: ''
            },
            loginForm: {
              email: '',
              password: ''
            },
            verifyCode: '',
            forgetPasswordForm: {
              email: '',
              verifyCode: '',
              password: ''
            },

            loading: false
          },
          created: function () {
            var that = this
            validAuth.readOAuthList()
              .then(function (data) {
                var OAuthList = data.filter(function (item) {
                  return item.enabled === true && item.name !== '小程序扫码登录'
                })
                that.OAuthList = OAuthList
              })
              .catch(function (err) {
                console.log(err)
              })
          },
          mounted: function () {
            this.pageVisible.loginVisible = true
          },
          methods: {
            removeGlobalMsg: function removeGlobalMsg() {
              this.warnVisible = false
              this.errVisible = false
              this.successVisible = false
            },
            showGlobalSuccess: function showGlobalSuccess(msg) {
              this.warnVisible = false
              this.errVisible = false
              this.successVisible = true
              this.successMsg = msg
            },
            showGlobalErr: function showGlobalErr(msg) {
              this.successVisible = false
              this.warnVisible = false
              this.errVisible = true
              this.errMsg = msg
            },
            showGlobalWarn: function showGlobalWarn(msg) {
              this.successVisible = false
              this.errVisible = false
              this.warnVisible = true
              this.warnMsg = msg
            },
            getPageState: function getPageState() {
              return Object.assign({}, this.pageVisible)
            },
            turnOnPage: function turnOnPage(visible) {
              this.removeGlobalMsg()
              var i
              for (i in this.pageVisible) {
                if (i === visible) {
                  this.pageVisible[i] = true
                } else {
                  this.pageVisible[i] = false
                }
              }
            },
            handleGoBack: function handleGoBack() {
              var lastState = this.pageStack.pop()
              if (lastState) {
                this.pageVisible = Object.assign({}, lastState)
              }
            },
            gotoLogin: function gotoLogin() {
              this.pageStack.push(this.getPageState())
              this.turnOnPage('loginVisible')
            },
            gotoSignUp: function gotoSignUp() {
              this.pageStack.push(this.getPageState())
              this.turnOnPage('signUpVisible')
            },
            gotoForgetPassword: function gotoForgetPassword() {
              this.pageStack.push(this.getPageState())
              this.turnOnPage('forgetPasswordVisible')
              this.pageVisible.forgetPasswordSendEmailVisible = true
            },
            checkEmail: function checkEmail() {
              if (!emailExp.test(this.signUpForm.email)) {
                this.showGlobalErr('请输入正确格式的邮箱')
                addAnimation('sign-up-email')
                removeRedLine('sign-up-username')
                removeRedLine('sign-up-password')
                removeRedLine('sign-up-re-password')
                setTimeout(function () {
                  removeAnimation('sign-up-email')
                }, 500)
              } else {
                removeRedLine('sign-up-email')
              }
            },
            handleSignUp: function handleSignUp() {
              console.log('handleSignUp')
              var that = this;
              if (!this.signUpForm.username) {
                this.showGlobalErr('请输入用户名')
                addAnimation('sign-up-username')
                removeRedLine('sign-up-email')
                removeRedLine('sign-up-password')
                removeRedLine('sign-up-re-password')
                setTimeout(function () {
                  removeAnimation('sign-up-username')
                }, 500)
                return false
              }
              if (!emailExp.test(this.signUpForm.email)) {
                this.showGlobalErr('请输入正确格式的邮箱')
                addAnimation('sign-up-email')
                removeRedLine('sign-up-username')
                removeRedLine('sign-up-password')
                removeRedLine('sign-up-re-password')
                setTimeout(function () {
                  removeAnimation('sign-up-email')
                }, 500)
                return false
              }
              if (!this.signUpForm.password) {
                this.showGlobalErr('请输入密码')
                addAnimation('sign-up-password')
                removeRedLine('sign-up-username')
                removeRedLine('sign-up-email')
                removeRedLine('sign-up-re-password')
                setTimeout(function () {
                  removeAnimation('sign-up-password')
                }, 500)
                return false

              }
              if (this.signUpForm.password !== this.signUpForm.rePassword) {
                this.showGlobalErr('两次密码不一致')
                addAnimation('sign-up-re-password')
                removeRedLine('sign-up-username')
                removeRedLine('sign-up-email')
                removeRedLine('sign-up-password')
                setTimeout(function () {
                  removeAnimation('sign-up-re-password')
                }, 500)
                return false

              }
              validAuth.register({
                email: this.signUpForm.email,
                username: this.signUpForm.username,
                password: this.signUpForm.password
              })
                .then(function (data) {
                  console.log(data)
                  that.errVisible = false
                })
                .catch(function (err) {
                  console.log(err)
                  that.showGlobalErr(err.message.message)
                })
            },
            handleLogin: function handleLogin() {
              var that = this;
              this.loading = true;
              var info;
              if (!emailExp.test(this.loginForm.email)) {
                this.showGlobalErr('请输入正确格式的邮箱')
                addAnimation('login-username')
                removeRedLine('login-password')
                removeRedLine('verify-code')
                setTimeout(function () {
                  removeAnimation('login-username')
                }, 500);
                this.loading = false;
                return false
              }
              if (!this.loginForm.password) {
                this.showGlobalErr('请输入密码')
                addAnimation('login-password')
                removeRedLine('verify-code')
                removeRedLine('login-username')
                setTimeout(function () {
                  removeAnimation('login-password')
                }, 500);
                this.loading = false;
                return false
              }
              if (this.verifyCodeVisible) {
                info = {
                  email: this.loginForm.email,
                  password: this.loginForm.password,
                  verifyCode: this.verifyCode
                }
              } else {
                info = {
                  email: this.loginForm.email,
                  password: this.loginForm.password,
                }
              }
              validAuth.login(info)
                .then(function (data) {
                  console.log('data', data)
                  that.showGlobalSuccess('验证通过')
                  that.loading = false;
                })
                .catch(function (err) {
                  console.log('err', err)
                  that.loading = false;
                  that.showGlobalErr(err.message.message)
                  if (err.message.code === 2000 || err.message.code === 2001) {
                    that.verifyCodeVisible = true
                    that.verifyCodeUrl = err.message.data.url
                    addAnimation('verify-code')
                    removeRedLine('login-username')
                    removeRedLine('login-password')
                    setTimeout(function () {
                      removeAnimation('verify-code')
                    }, 500)
                  }
                  if (err.message.code === 2003 || err.message.code === 2204 || err.message.code === 2208) {
                    addAnimation('login-username')
                    removeRedLine('login-password')
                    removeRedLine('verify-code')

                    setTimeout(function () {
                      removeAnimation('login-username')
                    }, 500)
                  }
                  if (err.message.code === 2006 || err.message.code === 2016 || err.message.code === 2027) {
                    addAnimation('login-password')
                    removeRedLine('verify-code')
                    removeRedLine('login-username')
                    setTimeout(function () {
                      removeAnimation('login-password')
                    }, 500)
                  }

                })

            },
            handleOauthLogin: function handleOauthLogin() {
              console.log('handleOauthLogin')

            },
            handleForgetPasswordSendEmail: function handleForgetPasswordSendEmail() {
              console.log('handleForgetPassword')
              var that = this
              if(!emailExp.test(this.forgetPasswordForm.email)) {
                this.showGlobalErr('请输入正确格式的邮箱')
                addAnimation('forget-password-email')
                setTimeout(function () {
                  removeAnimation('forget-password-email')
                }, 500)
                return false
              }
              validAuth.sendResetPasswordEmail({
                email: this.forgetPasswordForm.email
              })
                .then(function (data) {
                  that.showGlobalSuccess('验证码已发送至您的邮箱：' + that.forgetPasswordForm.email)
                  that.pageVisible.forgetPasswordSendEmailVisible = false
                  that.pageVisible.forgetPasswordVerifyCodeVisible = true
                })
                .catch(function (err) {
                  that.showGlobalErr(err.message)
                })
            },
            handleSubmitForgetPasswordVerifyCode: function handleSubmitForgetPasswordVerifyCode() {
              var that = this
              validAuth.verifyResetPasswordVerifyCode({
                email: that.forgetPasswordForm.email,
                verifyCode: that.forgetPasswordForm.verifyCode
              })
                .then(function (data) {
                  that.showGlobalSuccess(data.message)
                  that.pageVisible.forgetPasswordVerifyCodeVisible = false
                  that.pageVisible.forgetPasswordNewPasswordVisible = true
                })
                .catch(function (err) {
                  addAnimation('forget-password-verify-code')
                  setTimeout(function () {
                    removeAnimation('forget-password-verify-code')
                  }, 500)
                  that.showGlobalErr(err.message.message)
                })
            },
            handleSubmitForgetPasswordNewPassword: function handleSubmitForgetPasswordNewPassword() {
              var that = this
              validAuth.changePassword({
                email: that.forgetPasswordForm.email,
                password: that.forgetPasswordForm.password,
                verifyCode: that.forgetPasswordForm.verifyCode
              })
                .then(function (data) {
                  that.showGlobalSuccess('修改密码成功')
                })
                .catch(function (err) {
                  that.showGlobalErr(err.message.message)
                })
            },
            gotoWxQRCodeScanning: function gotoWxQRCodeScanning() {
              this.pageStack.push(this.getPageState())
              this.turnOnPage('wxQRCodeVisible')

              validAuth.startWXAppScaning({
                mount: 'qrcode-node'
              })
            }
            // checkRetype: function () {
            //   if(this.signUpForm.password!==this.signUpForm.rePassword) {
            //     addRedLine('sign-re-password')
            //   } else {
            //     removeRedLine()
            //   }
            // }
          }
        })
        console.log(document.getElementById('app').classList)
        document.getElementById('app').classList.remove('hide')
      })

    }).catch(function (error) {
      //验证失败
      console.log(error)
    })


  }

  return {
    hello: 'Authing Lock'
  }
}))
