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
    
    return {
        a: '1'
    }
  }));
  
  