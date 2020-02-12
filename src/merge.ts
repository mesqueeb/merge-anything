import { Object as ObjectTs } from 'ts-toolbelt'
import { isPlainObject, isSymbol } from 'is-what'

// @ts-ignore
type PlainObject = { [key: string | symbol]: any }

// type IsPlainObject<T> = T extends PlainObject ? true : false

// type Assign<T1, T2> = [IsPlainObject<T1>, IsPlainObject<T2>] extends [true, true]
//   ? ObjectTs.Merge<T1, T2>
//   : T2

// type Merged<T, U extends any[]> = {
//   0: T
//   1: ((...t: U) => any) extends (head: infer Head, ...tail: infer Tail) => any
//     ? Merged<Assign<T, Head>, Tail>
//     : never
// }[U['length'] extends 0 ? 0 : 1]

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
  newComer: T2
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
      newVal = mergeRecursively(targetVal, newVal)
    }
    assignProp(carry, key, newVal, newComer)
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
): ObjectTs.Assign<T, Tn> {
  // @ts-ignore
  return newComers.reduce((result, newComer) => {
    return mergeRecursively(result, newComer)
  }, origin)
}

// export function mergeAndCompare<T extends PlainObject, Tn extends PlainObject[]> (
//   compareFn: (prop1: any, prop2: any, propName: string | symbol) => any,
//   origin: T,
//   ...newComers: Tn
// ): Merged<T, Tn> {

// }

// export function mergeAndConcat<T extends PlainObject, Tn extends PlainObject[]> (
//   origin: T,
//   ...newComers: Tn
// ): Merged<T, Tn> {

// }
