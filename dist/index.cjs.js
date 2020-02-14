'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var isWhat = require('is-what');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function concatArrays(originVal, newVal) {
    if (isWhat.isArray(originVal) && isWhat.isArray(newVal)) {
        // concat logic
        return originVal.concat(newVal);
    }
    return newVal; // always return newVal as fallback!!
}

function assignProp(carry, key, newVal, originalObject) {
    var propType = {}.propertyIsEnumerable.call(originalObject, key)
        ? 'enumerable'
        : 'nonenumerable';
    if (propType === 'enumerable')
        carry[key] = newVal;
    if (propType === 'nonenumerable') {
        Object.defineProperty(carry, key, {
            value: newVal,
            enumerable: false,
            writable: true,
            configurable: true,
        });
    }
}
function mergeRecursively(origin, newComer, compareFn) {
    // always return newComer if its not an object
    if (!isWhat.isPlainObject(newComer))
        return newComer;
    // define newObject to merge all values upon
    var newObject = {};
    if (isWhat.isPlainObject(origin)) {
        var props_1 = Object.getOwnPropertyNames(origin);
        var symbols_1 = Object.getOwnPropertySymbols(origin);
        newObject = __spreadArrays(props_1, symbols_1).reduce(function (carry, key) {
            var targetVal = origin[key];
            if ((!isWhat.isSymbol(key) && !Object.getOwnPropertyNames(newComer).includes(key)) ||
                (isWhat.isSymbol(key) && !Object.getOwnPropertySymbols(newComer).includes(key))) {
                assignProp(carry, key, targetVal, origin);
            }
            return carry;
        }, {});
    }
    // newObject has all properties that newComer hasn't
    var props = Object.getOwnPropertyNames(newComer);
    var symbols = Object.getOwnPropertySymbols(newComer);
    var result = __spreadArrays(props, symbols).reduce(function (carry, key) {
        // re-define the origin and newComer as targetVal and newVal
        var newVal = newComer[key];
        var targetVal = isWhat.isPlainObject(origin) ? origin[key] : undefined;
        // When newVal is an object do the merge recursively
        if (targetVal !== undefined && isWhat.isPlainObject(newVal)) {
            newVal = mergeRecursively(targetVal, newVal, compareFn);
        }
        var propToAssign = compareFn ? compareFn(targetVal, newVal, key) : newVal;
        assignProp(carry, key, propToAssign, newComer);
        return carry;
    }, newObject);
    return result;
}
/**
 * Merge anything recursively.
 * Objects get merged, special objects (classes etc.) are re-assigned "as is".
 * Basic types overwrite objects or other basic types.
 *
 * @export
 * @template T
 * @template Tn
 * @param {T} origin
 * @param {...Tn} newComers
 * @returns {Assigned<T, Tn>}
 */
function merge(origin) {
    var newComers = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        newComers[_i - 1] = arguments[_i];
    }
    // @ts-ignore
    return newComers.reduce(function (result, newComer) {
        return mergeRecursively(result, newComer);
    }, origin);
}
function mergeAndCompare(compareFn, origin) {
    var newComers = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        newComers[_i - 2] = arguments[_i];
    }
    // @ts-ignore
    return newComers.reduce(function (result, newComer) {
        return mergeRecursively(result, newComer, compareFn);
    }, origin);
}
function mergeAndConcat(origin) {
    var newComers = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        newComers[_i - 1] = arguments[_i];
    }
    // @ts-ignore
    return newComers.reduce(function (result, newComer) {
        return mergeRecursively(result, newComer, concatArrays);
    }, origin);
}

exports.concatArrays = concatArrays;
exports.merge = merge;
exports.mergeAndCompare = mergeAndCompare;
exports.mergeAndConcat = mergeAndConcat;
