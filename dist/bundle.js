(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

function __async(g) {
  return new Promise(function (s, j) {
    function c(a, x) {
      try {
        var r = g[x ? "throw" : "next"](a);
      } catch (e) {
        j(e);return;
      }r.done ? s(r.value) : Promise.resolve(r.value).then(c, d);
    }function d(e) {
      c(e, 1);
    }c();
  });
}

// console.log(a,b,c);

function d() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var f = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

    console.log(1);
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(7);
        }, 3000);
    }).then(function (res) {
        return res;
    });
}


// console.log(cc);

})));
