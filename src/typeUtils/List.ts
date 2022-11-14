/**
 * A [[List]]
 * @param T its type
 * @returns [[List]]
 * @example
 * ```ts
 * type list0 = [1, 2, 3]
 * type list1 = number[]
 * ```
 */
export type List<T = any> = readonly T[]

/**
 * Get the length of `L`
 * @param L to get length
 * @returns [[String]] or `number`
 * @example
 * ```ts
 * ```
 */
export type Length<L extends List> = L['length']
