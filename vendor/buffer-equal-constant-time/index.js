'use strict';
var Buffer = require('buffer').Buffer;
var timingSafeEqual = require('crypto').timingSafeEqual;

function bufferEq(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

module.exports = bufferEq;

var origBufEqual = Buffer.prototype.equal;

bufferEq.install = function() {
  Buffer.prototype.equal = function equal(that) {
    return bufferEq(this, that);
  };
};

bufferEq.restore = function() {
  Buffer.prototype.equal = origBufEqual;
};
