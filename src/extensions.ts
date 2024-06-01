import { isArray } from 'is-what'

export function concatArrays<T>(originVal: unknown, newVal: T): T {
  if (isArray(originVal) && isArray(newVal)) {
    // concat logic
    return originVal.concat(newVal) as T
  }
  return newVal // always return newVal as fallback!!
}
