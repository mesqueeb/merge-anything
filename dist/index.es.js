import { isObject } from 'is-what';

function mergeRecursively(origin, newComer) {
  if (!isObject(newComer)) return newComer; // define newObject to merge all values upon

  var newObject = isObject(origin) ? Object.keys(origin).reduce(function (carry, key) {
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


    if (isObject(newVal)) {
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


function index (origin) {
  for (var _len = arguments.length, newComers = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    newComers[_key - 1] = arguments[_key];
  }

  return newComers.reduce(function (result, newComer) {
    if (!isObject(result)) console.error('Trying to merge target:', newComer, 'onto a non-object:', result);
    if (!isObject(newComer)) console.error('Trying to merge a non-object:', newComer, 'onto:', result);
    return mergeRecursively(result, newComer);
  }, origin);
}

export default index;
