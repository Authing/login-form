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
    global.AuthingForm = global.AuthingForm || factory();
  }
}(this, function () {

  var emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;

  function removeAnimation(className) {
    document.getElementById(className).classList.remove('animated');
    document.getElementById(className).classList.remove('shake');
  }

  function removeRedLine(className) {
    document.getElementById(className).classList.remove('err-hint');
  }

  function addRedLine(className) {
    document.getElementById(className).classList.add('err-hint');
  }

  function addAnimation(className) {
    document.getElementById(className).classList.add('animated');
    document.getElementById(className).classList.add('shake');
    document.getElementById(className).classList.add('err-hint');
    setTimeout(function () {
      removeAnimation(className);
    }, 500);
  }

  var AuthingForm = function (opts) {

    window.onload = function () {
      var loadBasicHTML = function () {
        var html = '';
        if (html) {
          document.body.innerHTML = html;
        }
      };
  
      var loadVue = function (onload) {
        var vueScript = document.createElement('script');
        vueScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/vue');
        vueScript.onload = onload;
        document.body.appendChild(vueScript);
      };
  
      loadBasicHTML();
  
      var clientId = '5b7f79f519915500015f18ac';
  
      loadVue(function () {
        var authingLockApp = new Vue({
          el: '#app',
          data: {
            validAuth: null,
  
            errMsg: '',
            successMsg: '',
            warnMsg: '',
            successVisible: false,
            errVisible: false,
            warnVisible: false,
  
            rememberMe: false,
  
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
              password: '',
            },
            verifyCode: '',
            forgetPasswordForm: {
              email: '',
              verifyCode: '',
              password: ''
            },
  
            loading: false,
            oAuthloading: false,
            verifyCodeLoading: true,
  
            isWxQRCodeGenerated: false,
  
            isScanCodeEnable: false
          },
          created: function () {
            var that = this;
            var auth = new Authing({
              clientId: clientId,
              secret: '82f36cba243e13f81f06675193732af7'
            });
            auth.then(function (validAuth) {
              document.getElementById('page-loading').remove();
              window.validAuth = validAuth;
              if (localStorage.getItem('_authing_username')) {
                this.rememberMe = true;
                this.loginForm.email = localStorage.getItem('_authing_username');
              }
              if (localStorage.getItem('_authing_password')) {
                this.loginForm.password = this.decrypt(localStorage.getItem('_authing_password'), clientId);
              }
              that.oAuthloading = true;
              validAuth.readOAuthList()
                .then(function (data) {
                  console.log(data);
                  that.oAuthloading = false;
                  var OAuthList = data.filter(function (item) {
                    if (item.alias === 'wxapp') {
                      that.isScanCodeEnable = true;
                    }
                    return item.enabled === true && item.alias !== 'wxapp';
                  });
                  that.OAuthList = OAuthList;
                })
                .catch(function (err) {
                  that.oAuthloading = true;
                });
            })
              .catch(function (err) {
                console.log(err);
              });
          },
          mounted: function () {
            this.pageVisible.loginVisible = true;
          },
          methods: {
            verifyCodeLoad: function () {
              this.verifyCodeLoading = false;
              console.log('verifyCode loaded');
            },
            encrypt: function encrypt(str, key) {
              while (str.length > key.length) {
                key += key;
              }
              var r = key.substr(0, str.length);
  
              var i = 0;
              var arr = [];
              for (i = 0; i < str.length; i++) {
                arr.push(str.charCodeAt(i) ^ r.charCodeAt(i));
              }
              var uglyStr = '';
              arr.map(function (char) {
                uglyStr += String.fromCharCode(char);
              });
              var out = window.btoa(uglyStr);
              return out;
            },
            decrypt: function decrypt(str, key) {
              str = window.atob(str);
              while (str.length > key.length) {
                key += key;
              }
              var r = key.substr(0, str.length);
  
              var i = 0;
              var arr = [];
              for (i = 0; i < str.length; i++) {
                arr.push(str.charCodeAt(i) ^ r.charCodeAt(i));
              }
              var uglyStr = '';
              arr.map(function (char) {
                uglyStr += String.fromCharCode(char);
              });
              return uglyStr;
            },
            removeGlobalMsg: function removeGlobalMsg() {
              this.warnVisible = false;
              this.errVisible = false;
              this.successVisible = false;
            },
            showGlobalSuccess: function showGlobalSuccess(msg) {
              this.warnVisible = false;
              this.errVisible = false;
              this.successVisible = true;
              this.successMsg = msg;
            },
            showGlobalErr: function showGlobalErr(msg) {
              this.successVisible = false;
              this.warnVisible = false;
              this.errVisible = true;
              this.errMsg = msg;
            },
            showGlobalWarn: function showGlobalWarn(msg) {
              this.successVisible = false;
              this.errVisible = false;
              this.warnVisible = true;
              this.warnMsg = msg;
            },
            setLoading: function loading() {
              this.loading = true;
            },
            unLoading: function unLoading() {
              this.loading = false;
            },
            getPageState: function getPageState() {
              return Object.assign({}, this.pageVisible);
            },
            turnOnPage: function turnOnPage(visible) {
              this.removeGlobalMsg();
              var i;
              for (i in this.pageVisible) {
                if (i === visible) {
                  this.pageVisible[i] = true;
                } else {
                  this.pageVisible[i] = false;
                }
              }
            },
            handleGoBack: function handleGoBack() {
              var lastState = this.pageStack.pop();
              if (lastState) {
                this.pageVisible = Object.assign({}, lastState);
              }
              if (this.loading) {
                this.unLoading();
              }
            },
            gotoLogin: function gotoLogin() {
              this.pageStack.push(this.getPageState());
              this.turnOnPage('loginVisible');
            },
            gotoSignUp: function gotoSignUp() {
              this.pageStack.push(this.getPageState());
              this.turnOnPage('signUpVisible');
            },
            gotoForgetPassword: function gotoForgetPassword() {
              this.pageStack.push(this.getPageState());
              this.turnOnPage('forgetPasswordVisible');
              this.forgetPasswordForm.email = this.loginForm.email;
              this.pageVisible.forgetPasswordSendEmailVisible = true;
            },
            checkEmail: function checkEmail() {
              if (!emailExp.test(this.signUpForm.email)) {
                this.showGlobalErr('请输入正确格式的邮箱');
                addAnimation('sign-up-email');
                removeRedLine('sign-up-username');
                removeRedLine('sign-up-password');
                removeRedLine('sign-up-re-password');
              } else {
                removeRedLine('sign-up-email');
              }
            },
            handleSignUp: function handleSignUp() {
              var that = this;
              that.setLoading();
              if (!this.signUpForm.username) {
                this.showGlobalErr('请输入用户名');
                addAnimation('sign-up-username');
                removeRedLine('sign-up-email');
                removeRedLine('sign-up-password');
                removeRedLine('sign-up-re-password');
                that.unLoading();
                return false;
              }
              if (!emailExp.test(this.signUpForm.email)) {
                this.showGlobalErr('请输入正确格式的邮箱');
                addAnimation('sign-up-email');
                removeRedLine('sign-up-username');
                removeRedLine('sign-up-password');
                removeRedLine('sign-up-re-password');
                that.unLoading();
                return false;
              }
              if (!this.signUpForm.password) {
                this.showGlobalErr('请输入密码');
                addAnimation('sign-up-password');
                removeRedLine('sign-up-username');
                removeRedLine('sign-up-email');
                removeRedLine('sign-up-re-password');
                that.unLoading();
                return false;
  
              }
              if (this.signUpForm.password !== this.signUpForm.rePassword) {
                this.showGlobalErr('两次密码不一致');
                addAnimation('sign-up-re-password');
                removeRedLine('sign-up-username');
                removeRedLine('sign-up-email');
                removeRedLine('sign-up-password');
                that.unLoading();
                return false;
              }
              validAuth.register({
                email: this.signUpForm.email,
                username: this.signUpForm.username,
                password: this.signUpForm.password
              })
              .then(function (data) {
                that.unLoading();
                that.errVisible = false;
                that.showGlobalSuccess('注册成功');
              })
              .catch(function (err) {
                that.unLoading();
                that.showGlobalErr(err.message.message);
                if (err.message.code === 2026) {
                  addAnimation('sign-up-email');
                  removeRedLine('sign-up-re-password');
                  removeRedLine('sign-up-username');
                  removeRedLine('sign-up-password');
                }
              });
            },
            handleLogin: function handleLogin() {
              var that = this;
              that.setLoading();
              var info;
  
              if (!emailExp.test(this.loginForm.email)) {
                this.showGlobalErr('请输入正确格式的邮箱');
                addAnimation('login-username');
                removeRedLine('login-password');
                removeRedLine('verify-code');
                that.unLoading();
                return false;
              }
              if (!this.loginForm.password) {
                this.showGlobalErr('请输入密码');
                addAnimation('login-password');
                removeRedLine('verify-code');
                removeRedLine('login-username');
                that.unLoading();
                return false;
              }
              if (this.pageVisible.verifyCodeVisible) {
                info = {
                  email: this.loginForm.email,
                  password: this.loginForm.password,
                  verifyCode: this.verifyCode
                };
              } else {
                info = {
                  email: this.loginForm.email,
                  password: this.loginForm.password,
                };
              }
              validAuth.login(info)
              .then(function (data) {
                if (that.rememberMe) {
                  localStorage.setItem('_authing_username', that.loginForm.email);
                  localStorage.setItem('_authing_password', that.encrypt(that.loginForm.password, clientId));
                } else {
                  localStorage.removeItem('_authing_username');
                  localStorage.removeItem('_authing_password');
                }
  
                that.showGlobalSuccess('验证通过，欢迎你：' + data.username || data.email);
                that.unLoading();
              })
              .catch(function (err) {
                that.unLoading();
                that.showGlobalErr(err.message.message);
                if (err.message.code === 2000 || err.message.code === 2001) {
                  that.verifyCodeLoading = true;
                  that.pageVisible.verifyCodeVisible = true;
                  that.verifyCodeUrl = err.message.data.url;
  
                  addAnimation('verify-code');
                  removeRedLine('login-username');
                  removeRedLine('login-password');
                }
                if (err.message.code === 2003 || err.message.code === 2204 || err.message.code === 2208) {
                  addAnimation('login-username');
                  removeRedLine('login-password');
                  removeRedLine('verify-code');
                }
                if (err.message.code === 2006 || err.message.code === 2016 || err.message.code === 2027) {
                  addAnimation('login-password');
                  removeRedLine('verify-code');
                  removeRedLine('login-username');
                }
              });
            },
            handleForgetPasswordSendEmail: function handleForgetPasswordSendEmail() {
              var that = this;
              that.setLoading();
              if (!emailExp.test(this.forgetPasswordForm.email)) {
                this.showGlobalErr('请输入正确格式的邮箱');
                addAnimation('forget-password-email');
                that.unLoading();
                return false;
              }
              validAuth.sendResetPasswordEmail({
                email: this.forgetPasswordForm.email
              })
              .then(function (data) {
                that.unLoading();
                that.showGlobalSuccess('验证码已发送至您的邮箱：' + that.forgetPasswordForm.email);
                that.pageVisible.forgetPasswordSendEmailVisible = false;
                that.pageVisible.forgetPasswordVerifyCodeVisible = true;
              })
              .catch(function (err) {
                that.unLoading();
                that.showGlobalErr(err.message);
              });
            },
            handleSubmitForgetPasswordVerifyCode: function handleSubmitForgetPasswordVerifyCode() {
              var that = this;
              that.setLoading();
              if (!this.forgetPasswordForm.verifyCode) {
                that.unLoading();
                addAnimation('forget-password-verify-code');
                ;
                that.showGlobalErr('请输入验证码');
                return false;
              }
              validAuth.verifyResetPasswordVerifyCode({
                email: that.forgetPasswordForm.email,
                verifyCode: that.forgetPasswordForm.verifyCode
              })
              .then(function (data) {
                that.unLoading();
                that.showGlobalSuccess(data.message);
                that.pageVisible.forgetPasswordVerifyCodeVisible = false;
                that.pageVisible.forgetPasswordNewPasswordVisible = true;
              })
              .catch(function (err) {
                that.unLoading();
                addAnimation('forget-password-verify-code');
                that.showGlobalErr(err.message.message);
              });
            },
            handleSubmitForgetPasswordNewPassword: function handleSubmitForgetPasswordNewPassword() {
              var that = this;
              that.setLoading();
              validAuth.changePassword({
                email: that.forgetPasswordForm.email,
                password: that.forgetPasswordForm.password,
                verifyCode: that.forgetPasswordForm.verifyCode
              })
              .then(function (data) {
                that.unLoading();
                that.showGlobalSuccess('修改密码成功');
                that.gotoLogin();
              })
              .catch(function (err) {
                that.unLoading();
                that.showGlobalErr(err.message.message);
              });
            },
            gotoWxQRCodeScanning: function gotoWxQRCodeScanning() {
              this.pageStack.push(this.getPageState());
              this.turnOnPage('wxQRCodeVisible');
  
              if (!this.isWxQRCodeGenerated) {
                validAuth.startWXAppScaning({
                  mount: 'qrcode-node'
                });
                this.isWxQRCodeGenerated = true;
              }
            }
          },
          watch: {
            rememberMe: function (newVal, oldVal) {
              if (newVal === false) {
                localStorage.removeItem('_authing_username');
                localStorage.removeItem('_authing_password');
              }
            }
          }
        });
  
        document.getElementById('app').classList.remove('hide');
      });
  
    };    

  };

  AuthingForm.prototype = {
    show: function () {

    },

    hide: function () {

    },

    on: function () {

    }
  };

  return AuthingForm;
}));
