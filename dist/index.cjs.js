'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isWhat = require('is-what');

function mergeRecursively(origin, newComer, extensions) {
  // work directly on newComer if its not an object
  if (!isWhat.isObject(newComer)) {
    // extend merge rules
    if (extensions && isWhat.isArray(extensions)) {
      extensions.forEach(function (extend) {
        newComer = extend(origin, newComer);
      });
    }

    return newComer;
  } // define newObject to merge all values upon


  var newObject = isWhat.isObject(origin) ? Object.keys(origin).reduce(function (carry, key) {
    var targetVal = origin[key];
    if (!Object.keys(newComer).includes(key)) carry[key] = targetVal;
    return carry;
  }, {}) : {};
  return Object.keys(newComer).reduce(function (carry, key) {
    // re-define the origin and newComer as targetVal and newVal
    var newVal = newComer[key];
    var targetVal = isWhat.isObject(origin) ? origin[key] : undefined; // extend merge rules

    if (extensions && isWhat.isArray(extensions)) {
      extensions.forEach(function (extend) {
        newVal = extend(targetVal, newVal);
      });
    } // early return when targetVal === undefined


    if (targetVal === undefined) {
      carry[key] = newVal;
      return carry;
    } // When newVal is an object do the merge recursively


    if (isWhat.isObject(newVal)) {
      carry[key] = mergeRecursively(targetVal, newVal);
      return carry;
    } // all the rest


    carry[key] = newVal;
    return carry;
  }, newObject);
}
/**
 * Merge anything
 *
 * @param {object} origin the default values, OR {extensions} to pass an array of functions with extentions
 * @param {object} newComer on which to set the default values
 */


function index (origin) {
  var extensions = null;
  var base = origin;

  if (origin['extensions'] && Object.keys(origin).length === 1) {
    base = {};
    extensions = origin.extensions;
  }

  for (var _len = arguments.length, newComers = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    newComers[_key - 1] = arguments[_key];
  }

  return newComers.reduce(function (result, newComer) {
    return mergeRecursively(result, newComer, extensions);
  }, base);
}

exports.default = index;
