import { isArray, isPlainObject, isSymbol } from 'is-what';

function concatArrays(originVal, newVal) {
  if (isArray(originVal) && isArray(newVal)) {
    return originVal.concat(newVal);
  }
  return newVal;
}

function assignProp(carry, key, newVal, originalObject) {
  const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
  if (propType === "enumerable")
    carry[key] = newVal;
  if (propType === "nonenumerable") {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
}
function mergeRecursively(origin, newComer, compareFn) {
  if (!isPlainObject(newComer))
    return newComer;
  let newObject = {};
  if (isPlainObject(origin)) {
    const props2 = Object.getOwnPropertyNames(origin);
    const symbols2 = Object.getOwnPropertySymbols(origin);
    newObject = [...props2, ...symbols2].reduce((carry, key) => {
      const targetVal = origin[key];
      if (!isSymbol(key) && !Object.getOwnPropertyNames(newComer).includes(key) || isSymbol(key) && !Object.getOwnPropertySymbols(newComer).includes(key)) {
        assignProp(
          carry,
          key,
          targetVal,
          origin
        );
      }
      return carry;
    }, {});
  }
  const props = Object.getOwnPropertyNames(newComer);
  const symbols = Object.getOwnPropertySymbols(newComer);
  const result = [...props, ...symbols].reduce((carry, key) => {
    let newVal = newComer[key];
    const targetVal = isPlainObject(origin) ? origin[key] : void 0;
    if (targetVal !== void 0 && isPlainObject(newVal)) {
      newVal = mergeRecursively(targetVal, newVal, compareFn);
    }
    const propToAssign = compareFn ? compareFn(targetVal, newVal, key) : newVal;
    assignProp(
      carry,
      key,
      propToAssign,
      newComer
    );
    return carry;
  }, newObject);
  return result;
}
function merge(object, ...otherObjects) {
  return otherObjects.reduce((result, newComer) => {
    return mergeRecursively(result, newComer);
  }, object);
}
function mergeAndCompare(compareFn, object, ...otherObjects) {
  return otherObjects.reduce((result, newComer) => {
    return mergeRecursively(result, newComer, compareFn);
  }, object);
}
function mergeAndConcat(object, ...otherObjects) {
  return otherObjects.reduce((result, newComer) => {
    return mergeRecursively(result, newComer, concatArrays);
  }, object);
}

export { concatArrays, merge, mergeAndCompare, mergeAndConcat };
