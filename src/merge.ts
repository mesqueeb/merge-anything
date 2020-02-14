import { O } from 'ts-toolbelt'
import { isPlainObject, isSymbol } from 'is-what'
import { concatArrays } from './extensions'

// @ts-ignore
type PlainObject = { [key: string | symbol]: any }

function assignProp (
  carry: PlainObject,
  key: string | symbol,
  newVal: any,
  originalObject: PlainObject
): void {
  const propType = {}.propertyIsEnumerable.call(originalObject, key)
    ? 'enumerable'
    : 'nonenumerable'
  if (propType === 'enumerable') carry[key] = newVal
  if (propType === 'nonenumerable') {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true,
    })
  }
}

function mergeRecursively<T1 extends PlainObject | any, T2 extends PlainObject | any> (
  origin: T1,
  newComer: T2,
  compareFn?: (prop1: any, prop2: any, propName: string | symbol) => any
): (T1 & T2) | T2 {
  // always return newComer if its not an object
  if (!isPlainObject(newComer)) return newComer
  // define newObject to merge all values upon
  let newObject = {} as (T1 & T2) | T2
  if (isPlainObject(origin)) {
    const props = Object.getOwnPropertyNames(origin)
    const symbols = Object.getOwnPropertySymbols(origin)
    newObject = [...props, ...symbols].reduce((carry, key) => {
      const targetVal = origin[key]
      if (
        (!isSymbol(key) && !Object.getOwnPropertyNames(newComer).includes(key)) ||
        (isSymbol(key) && !Object.getOwnPropertySymbols(newComer).includes(key))
      ) {
        assignProp(carry, key, targetVal, origin)
      }
      return carry
    }, {} as (T1 & T2) | T2)
  }
  // newObject has all properties that newComer hasn't
  const props = Object.getOwnPropertyNames(newComer)
  const symbols = Object.getOwnPropertySymbols(newComer)
  const result = [...props, ...symbols].reduce((carry, key) => {
    // re-define the origin and newComer as targetVal and newVal
    let newVal = newComer[key]
    const targetVal = isPlainObject(origin) ? origin[key] : undefined
    // When newVal is an object do the merge recursively
    if (targetVal !== undefined && isPlainObject(newVal)) {
      newVal = mergeRecursively(targetVal, newVal, compareFn)
    }
    const propToAssign = compareFn ? compareFn(targetVal, newVal, key) : newVal
    assignProp(carry, key, propToAssign, newComer)
    return carry
  }, newObject)
  return result
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
export function merge<T extends PlainObject, Tn extends PlainObject[]> (
  origin: T,
  ...newComers: Tn
): O.Assign<T, Tn, 'deep'> {
  // @ts-ignore
  return newComers.reduce((result, newComer) => {
    return mergeRecursively(result, newComer)
  }, origin)
}

export function mergeAndCompare<T extends PlainObject, Tn extends PlainObject[]> (
  compareFn: (prop1: any, prop2: any, propName: string | symbol) => any,
  origin: T,
  ...newComers: Tn
): O.Assign<T, Tn, 'deep'> {
  // @ts-ignore
  return newComers.reduce((result, newComer) => {
    return mergeRecursively(result, newComer, compareFn)
  }, origin)
}

export function mergeAndConcat<T extends PlainObject, Tn extends PlainObject[]> (
  origin: T,
  ...newComers: Tn
): O.Assign<T, Tn, 'deep'> {
  // @ts-ignore
  return newComers.reduce((result, newComer) => {
    return mergeRecursively(result, newComer, concatArrays)
  }, origin)
}
