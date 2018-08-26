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

    var 

      PLACEHOLDER_TEXT = {
        'USERNAME': '请输入用户名',
        'EMAIL': '请输入邮箱',
        'PASSWORD': '请输入密码',
        'CONFIRM_PASSWORD': '请确认密码',
        'VERIFY_CODE': '请输入验证码',
        'NEW_PASSWORD': '请输入新密码'
      },
    
      loadVue = function (onload) {
        var vueScript = document.createElement('script');
        vueScript.setAttribute('src', 'https://cdn.jsdelivr.net/npm/vue');
        vueScript.onload = onload;
        document.body.appendChild(vueScript);
      },

      loadBasicHTML = function () {
        var html = '';
        if (html) {
          document.body.innerHTML = html;
        }
      },

      emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/,

      appMountId = '_authing_login_form',

      $authing = this;

      $authing.eventsList = {
        'authingload': [],
        'authingunload': [],

        'oauthload': [],
        'oauthunload': [],

        'login': [],
        'loginerror': [],
        'register': [],
        'registererror': [],

        'emailsent': [],
        'resetpassword': [],
        'resetpassworderror': [],

        'scanning': [],
        'scanningerror': [],
        'scanningintervalstarting': []
      };

      $authing.opts = opts;

      $authing.opts.hideQRCode = opts.hideQRCode || false;
      $authing.opts.hideUP = opts.hideUP || false;
      $authing.opts.hideOAuth = opts.hideOAuth || false;
      $authing.opts.hideUsername = opts.hideUsername || false;      

      $authing.opts.forceLogin = opts.forceLogin || false;
      $authing.opts.title = opts.title || 'Authing';
      $authing.opts.logo = opts.logo || 'https://cdn.authing.cn/authing-logo.png';      

      // 初始化小程序扫码登录配置 
      if(opts.qrcodeScanning) {
        opts.qrcodeScanning.redirect = opts.qrcodeScanning.redirect || true;
        opts.qrcodeScanning.interval = opts.qrcodeScanning.interval || 1500;
        opts.qrcodeScanning.tips = opts.qrcodeScanning.tips || null;
      }

      // 初始化 placeholder
      if (opts.placeholder) {
        opts.placeholder.username = opts.placeholder.username || PLACEHOLDER_TEXT.USERNAME;
        opts.placeholder.email = opts.placeholder.email || PLACEHOLDER_TEXT.EMAIL;
        opts.placeholder.password = opts.placeholder.password || PLACEHOLDER_TEXT.PASSWORD;
        opts.placeholder.confirmPassword = opts.placeholder.confirmPassword || PLACEHOLDER_TEXT.USERNAME;
        opts.placeholder.verfiyCode = opts.placeholder.verfiyCode || PLACEHOLDER_TEXT.VERIFY_CODE;
        opts.placeholder.newPassword = opts.placeholder.newPassword || PLACEHOLDER_TEXT.NEW_PASSWORD;
      }else {
        opts.placeholder = {
          username: PLACEHOLDER_TEXT.USERNAME,
          email: PLACEHOLDER_TEXT.EMAIL,
          password: PLACEHOLDER_TEXT.PASSWORD,
          confirmPassword: PLACEHOLDER_TEXT.CONFIRM_PASSWORD,
          verfiyCode: PLACEHOLDER_TEXT.VERIFY_CODE,
          newPassword: PLACEHOLDER_TEXT.NEW_PASSWORD  
        }
      }

      $authing.opts.placeholder = opts.placeholder;

      console.log($authing.opts);

    window.onload = function () {
    
      loadBasicHTML();
    
      loadVue(function () {
        $authing.authingLockApp = new Vue({
          el: '#' + appMountId,
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
  
            isScanCodeEnable: false,

            opts: $authing.opts

          },
          created: function () {
            var that = this;
            var auth = new Authing({
              clientId: opts.clientId,
              secret: opts.secret
            });
            auth.then(function (validAuth) {
              document.getElementById('page-loading').remove();
              window.validAuth = validAuth;

              $authing.pub('authingLoad', validAuth);

              if (localStorage.getItem('_authing_username')) {
                that.rememberMe = true;
                that.loginForm.email = localStorage.getItem('_authing_username');
              }
              if (localStorage.getItem('_authing_password')) {
                that.loginForm.password = that.decrypt(localStorage.getItem('_authing_password'), opts.clientId);
              }

              if(!that.opts.hideOAuth) {
                // that.oAuthloading = true;
                validAuth.readOAuthList()
                .then(function (data) {
                  document.getElementById(appMountId).classList.remove('hide');
                  $authing.pub('oauthLoad', data);
                  // that.oAuthloading = false;
  
                  var OAuthList = data.filter(function (item) {
                    if (item.alias === 'wxapp') {
                      that.isScanCodeEnable = true;
                    }
                    return item.enabled === true && item.alias !== 'wxapp';
                  });
  
                  that.OAuthList = OAuthList;
  
                })
                .catch(function (err) {
                  document.getElementById(appMountId).classList.remove('hide');
                  $authing.pub('oauthUnload', err);
                  // that.oAuthloading = true;
                });                
              }else {
                if(!that.opts.hideQRCode) {
                  that.isScanCodeEnable = true;
                }
              }
            })
            .catch(function (err) {
              $authing.pub('authingUnload', err);
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
            encryptMethod: function encryptMethod(str, key) {
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
              return uglyStr
            },
            encrypt: function encrypt(str, key) {
              var out = window.btoa(this.encryptMethod(str, key));
              return out;
            },
            decrypt: function decrypt(str, key) {
              str = window.atob(str);
              return this.encryptMethod(str, key)
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
              if (!$authing.opts.hideUsername && !this.signUpForm.username) {
                this.showGlobalErr('请输入用户名');
                addAnimation('sign-up-username');
                removeRedLine('sign-up-email');
                removeRedLine('sign-up-password');
                removeRedLine('sign-up-re-password');
                that.unLoading();
                $authing.pub('registerError', '请输入用户名');
                return false;
              }
              if (!emailExp.test(this.signUpForm.email)) {
                this.showGlobalErr('请输入正确格式的邮箱');
                addAnimation('sign-up-email');
                removeRedLine('sign-up-username');
                removeRedLine('sign-up-password');
                removeRedLine('sign-up-re-password');
                that.unLoading();
                $authing.pub('registerError', '请输入正确格式的邮箱');
                return false;
              }
              if (!this.signUpForm.password) {
                this.showGlobalErr('请输入密码');
                addAnimation('sign-up-password');
                removeRedLine('sign-up-username');
                removeRedLine('sign-up-email');
                removeRedLine('sign-up-re-password');
                that.unLoading();
                $authing.pub('registerError', '请输入密码');
                return false;
              }
              if (this.signUpForm.password !== this.signUpForm.rePassword) {
                this.showGlobalErr('两次密码不一致');
                addAnimation('sign-up-re-password');
                removeRedLine('sign-up-username');
                removeRedLine('sign-up-email');
                removeRedLine('sign-up-password');
                that.unLoading();
                $authing.pub('registerError', '两次密码不一致');
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
                that.gotoLogin();
                that.showGlobalSuccess('注册成功');                
                $authing.pub('register', data);
              })
              .catch(function (err) {
                that.unLoading();
                that.showGlobalErr(err.message.message);
                $authing.pub('registerError', err);
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
              var info = {
                email: this.loginForm.email,
                password: this.loginForm.password,
              };
  
              if (!emailExp.test(this.loginForm.email)) {
                this.showGlobalErr('请输入正确格式的邮箱');
                addAnimation('login-username');
                removeRedLine('login-password');
                removeRedLine('verify-code');
                that.unLoading();                
                $authing.pub('loginError', '请输入正确格式的邮箱');
                return false;
              }
              if (!this.loginForm.password) {
                this.showGlobalErr('请输入密码');
                addAnimation('login-password');
                removeRedLine('verify-code');
                removeRedLine('login-username');
                that.unLoading();
                $authing.pub('loginError', '请输入密码');
                return false;
              }
              if (this.pageVisible.verifyCodeVisible) {
                info.verifyCode = this.verifyCode
              }
              validAuth.login(info)
              .then(function (data) {
                if (that.rememberMe) {
                  localStorage.setItem('_authing_username', that.loginForm.email);
                  localStorage.setItem('_authing_password', that.encrypt(that.loginForm.password, opts.clientId));
                } else {
                  localStorage.removeItem('_authing_username');
                  localStorage.removeItem('_authing_password');
                }
  
                that.showGlobalSuccess('验证通过，欢迎你：' + data.username || data.email);
                $authing.pub('login', data);
                that.unLoading();
              })
              .catch(function (err) {
                that.unLoading();
                $authing.pub('loginError', err);
                that.showGlobalErr(err.message.message);
                // 验证码错误
                if (err.message.code === 2000 || err.message.code === 2001) {
                  addAnimation('verify-code');
                  removeRedLine('login-username');
                  removeRedLine('login-password');

                  that.verifyCodeLoading = true;
                  that.pageVisible.verifyCodeVisible = true;
                  that.verifyCodeUrl = err.message.data.url;
                }
                // 用户名错误
                else if (err.message.code === 2003 || err.message.code === 2204 || err.message.code === 2208) {
                  addAnimation('login-username');
                  removeRedLine('login-password');
                  removeRedLine('verify-code');
                }
                // 用户名不存在
                else if(err.message.code === 2004){
                  // 如果开启登录时创建不存在的用户功能
                  if($authing.opts.forceLogin) {
                    that.setLoading()
                    console.log('turn on forceLogin');
                    validAuth.register({
                      email: that.loginForm.email,
                      password: that.loginForm.password,
                    })
                      .then(function (data) {
                        that.unLoading()
                        that.showGlobalSuccess('验证通过，欢迎你：' + data.username || data.email);
                        $authing.pub('login', data);
                      })
                      .catch(function (err) {
                        that.unLoading()
                        that.showGlobalErr(err.message.message);
                        $authing.pub('loginError', err);
                      });
                    return false
                  } else {
                    addAnimation('login-username');
                    removeRedLine('login-password');
                    removeRedLine('verify-code');
                  }
                }
                // 密码错误
                else if (err.message.code === 2006 || err.message.code === 2016 || err.message.code === 2027) {
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
                $authing.pub('emailSentError', '请输入正确格式的邮箱');
                return false;
              }
              validAuth.sendResetPasswordEmail({
                email: this.forgetPasswordForm.email
              })
              .then(function (data) {
                $authing.pub('emailSent', data);
                that.unLoading();
                that.showGlobalSuccess('验证码已发送至您的邮箱：' + that.forgetPasswordForm.email);
                that.pageVisible.forgetPasswordSendEmailVisible = false;
                that.pageVisible.forgetPasswordVerifyCodeVisible = true;
              })
              .catch(function (err) {
                $authing.pub('emailSentError', err);
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
                $authing.pub('resetPasswordError', '请输入验证码');
                return false;
              }
              validAuth.verifyResetPasswordVerifyCode({
                email: that.forgetPasswordForm.email,
                verifyCode: that.forgetPasswordForm.verifyCode
              })
              .then(function (data) {
                $authing.pub('resetPassword', data);
                that.unLoading();
                that.showGlobalSuccess(data.message);
                that.pageVisible.forgetPasswordVerifyCodeVisible = false;
                that.pageVisible.forgetPasswordNewPasswordVisible = true;
              })
              .catch(function (err) {
                $authing.pub('resetPasswordError', err);
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
                $authing.pub('resetPassword', data);
                that.unLoading();
                that.showGlobalSuccess('修改密码成功');
                that.gotoLogin();
              })
              .catch(function (err) {
                $authing.pub('resetPasswordError', err);
                that.unLoading();
                that.showGlobalErr(err.message.message);
              });
            },
            gotoWxQRCodeScanning: function gotoWxQRCodeScanning() {
              this.pageStack.push(this.getPageState());
              this.turnOnPage('wxQRCodeVisible');

              var scanOpts = $authing.opts.qrcodeScanning || {
                redirect: true,
                interval: 1500,
                tips: '使用 微信 或小程序 身份管家 扫码登录'
              };
  
              if (!this.isWxQRCodeGenerated) {
                validAuth.startWXAppScaning({
                  mount: 'qrcode-node',

                  onSuccess: function(res) {
                    $authing.pub('scanning', res);
                  },

                  onError: function(err) {
                    $authing.pub('scanningError', err);
                  },

                  onIntervalStarting: function(interval) {
                    $authing.pub('scanningIntervalStarting', interval);
                  },

                  interval: scanOpts.interval,

                  redirect: scanOpts.redirect,

                  tips: scanOpts.tips
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
  
      });
  
    };    

  };

  AuthingForm.prototype = {
    show: function () {

    },

    hide: function () {

    },

    on: function (eventName, cb) {
      eventName = eventName.toLowerCase();
      if(cb && eventName && this.eventsList[eventName]) {
        this.eventsList[eventName].push(cb);
      }
    },

    pub: function (eventName, params) {
      eventName = eventName.toLowerCase();
      if(eventName && this.eventsList[eventName]) {
        for(var i = 0; i < this.eventsList[eventName].length; i++) {
          var cb = this.eventsList[eventName][i];
          cb(params);
        }
      }
    }
  };

  return AuthingForm;
}));
