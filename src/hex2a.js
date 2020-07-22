'use strict';

const assert = require('assert');
const N_TO_A = 'a'.charCodeAt(0) - '0'.charCodeAt(0);
const A_TO_K = 'k'.charCodeAt(0) - 'a'.charCodeAt(0);

/**
 * `tr '0-9a-f' 'a-p'` in JS
 *
 * @param {string} hex like '8a7f7d'
 * @return {string}
 */
function hex2a(hex) {
  assert.equal(typeof hex, 'string');

  return Array.from(hex).map(s => {
    if ('0' <= s && s <= '9') {
      return String.fromCharCode(s.charCodeAt(0) + N_TO_A);
    } else if ('a' <= s && s <= 'f') {
      return String.fromCharCode(s.charCodeAt(0) + A_TO_K);
    } else {
      throw new Error(`invalid char: ${s}`);
    }
  }).join('');
}

module.exports = hex2a;
