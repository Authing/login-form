import Vue from 'vue'
import App from './App.vue'

var AuthingForm = function(opts) {
  var

    PLACEHOLDER_TEXT = {
      'USERNAME': '请输入用户名',
      'EMAIL': '请输入邮箱',
      'PASSWORD': '请输入密码',
      'CONFIRM_PASSWORD': '请确认密码',
      'VERIFY_CODE': '请输入验证码',
      'NEW_PASSWORD': '请输入新密码'
    },


    appMountId = '_authing_login_form',
    // appMountId = 'app',

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
  if (opts.qrcodeScanning) {
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
  } else {
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

  window.$authing = $authing;
  window.appMountId = appMountId;
  window.emailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/;
}

AuthingForm.prototype = {
  show: function(appMountId) {
  	var target = document.getElementById(appMountId);
  	var newMount = document.createElement('div');
  	newMount.setAttribute('id', '_authing_login_form');
  	target.appendChild(newMount);
    new Vue({
      el: '#_authing_login_form',
      render: h => h(App)
    })
  },

  hide: function() {

  },

  on: function(eventName, cb) {
    eventName = eventName.toLowerCase();
    if (cb && eventName && this.eventsList[eventName]) {
      this.eventsList[eventName].push(cb);
    }
  },

  pub: function(eventName, params) {
    eventName = eventName.toLowerCase();
    if (eventName && this.eventsList[eventName]) {
      for (var i = 0; i < this.eventsList[eventName].length; i++) {
        var cb = this.eventsList[eventName][i];
        cb(params);
      }
    }
  }
};
window.AuthingForm = AuthingForm;
