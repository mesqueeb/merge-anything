import { O } from 'ts-toolbelt'
import { isPlainObject, isSymbol } from 'is-what'
import { concatArrays } from './extensions'

type PlainObject = { [key: string]: any }

function assignProp(
  carry: PlainObject,
  key: string,
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

function mergeRecursively<T1 extends PlainObject | any, T2 extends PlainObject | any>(
  origin: T1,
  newComer: T2,
  compareFn?: (prop1: any, prop2: any, propName: string) => any
): (T1 & T2) | T2 {
  // always return newComer if its not an object
  if (!isPlainObject(newComer)) return newComer
  // define newObject to merge all values upon
  let newObject = {} as (T1 & T2) | T2
  if (isPlainObject(origin)) {
    const props = Object.getOwnPropertyNames(origin)
    const symbols = Object.getOwnPropertySymbols(origin)
    newObject = [...props, ...symbols].reduce((carry, key) => {
      const targetVal = origin[key as string]
      if (
        (!isSymbol(key) && !Object.getOwnPropertyNames(newComer).includes(key)) ||
        (isSymbol(key) && !Object.getOwnPropertySymbols(newComer).includes(key))
      ) {
        assignProp(carry as PlainObject, key as string, targetVal, origin)
      }
      return carry
    }, {} as (T1 & T2) | T2)
  }
  // newObject has all properties that newComer hasn't
  const props = Object.getOwnPropertyNames(newComer)
  const symbols = Object.getOwnPropertySymbols(newComer)
  const result = [...props, ...symbols].reduce((carry, key) => {
    // re-define the origin and newComer as targetVal and newVal
    let newVal = newComer[key as string]
    const targetVal = isPlainObject(origin) ? origin[key as string] : undefined
    // When newVal is an object do the merge recursively
    if (targetVal !== undefined && isPlainObject(newVal)) {
      newVal = mergeRecursively(targetVal, newVal, compareFn)
    }
    const propToAssign = compareFn ? compareFn(targetVal, newVal, key as string) : newVal
    assignProp(carry as PlainObject, key as string, propToAssign, newComer)
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
export function merge<T extends object, Tn extends object[]>(
  origin: T,
  ...newComers: Tn
): O.Compact<T, Tn, 'deep'> {
  // @ts-ignore
  return newComers.reduce((result, newComer) => {
    return mergeRecursively(result, newComer)
  }, origin)
}

export function mergeAndCompare<T extends object, Tn extends object[]>(
  compareFn: (prop1: any, prop2: any, propName: string | symbol) => any,
  origin: T,
  ...newComers: Tn
): O.Compact<T, Tn, 'deep'> {
  // @ts-ignore
  return newComers.reduce((result, newComer) => {
    return mergeRecursively(result, newComer, compareFn)
  }, origin)
}

export function mergeAndConcat<T extends object, Tn extends object[]>(
  origin: T,
  ...newComers: Tn
): O.Compact<T, Tn, 'deep'> {
  // @ts-ignore
  return newComers.reduce((result, newComer) => {
    return mergeRecursively(result, newComer, concatArrays)
  }, origin)
}
