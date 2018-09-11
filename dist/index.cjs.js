'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isWhat = require('is-what');

function mergeRecursively(origin, newComer) {
  if (!isWhat.isObject(newComer)) return newComer; // define newObject to merge all values upon

  var newObject = isWhat.isObject(origin) ? Object.keys(origin).reduce(function (carry, key) {
    var targetVal = origin[key];
    if (!Object.keys(newComer).includes(key)) carry[key] = targetVal;
    return carry;
  }, {}) : {};
  return Object.keys(newComer).reduce(function (carry, key) {
    var newVal = newComer[key];
    var targetVal = origin[key]; // early return when targetVal === undefined

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
 * @param {object} origin the default values
 * @param {object} newComer on which to set the default values
 */


function index (origin, newComer) {
  if (!isWhat.isObject(origin)) console.error('Trying to merge target:', newComer, 'onto a non-object:', origin);
  if (!isWhat.isObject(newComer)) console.error('Trying to merge a non-object:', newComer, 'onto:', origin);
  return mergeRecursively(origin, newComer); // return merge(origin, newComer)
}

exports.default = index;
