/**
 * A [[List]]
 *
 * @example
 *   ;```ts
 *   type list0 = [1, 2, 3]
 *   type list1 = number[]
 *   ```
 *
 * @param T Its type
 * @returns {undefined} [List]
 */
export type List<T = unknown> = readonly T[]

/**
 * Get the length of `L`
 *
 * @example
 *   ;```ts
 *   ```
 *
 * @param L To get length
 * @returns {undefined} [String] or `number`
 */
export type Length<L extends List> = L['length']

/**
 * Return the last item out of a [[List]]
 *
 * @example
 *   ;```ts
 *   ```
 *
 * @param L
 * @returns {undefined} [List]
 */
export type Pop<L extends List> = L extends readonly []
  ? never
  : L extends [...unknown[], infer Last]
    ? Last
    : L extends (infer T)[]
      ? T
      : never
