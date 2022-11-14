/**
 * Make an object properties (all) `never`. We use this to intersect `object`s and
 * preserve the combine modifiers like `+readonly` and `?optional`.
 */
declare type Anyfy<O extends object> = {
    [K in keyof O]: any;
};
/**
 * Get in `O` the type of a field of key `K`
 * @param O to extract from
 * @param K to extract at
 * @returns [[Any]]
 * @example
 * ```ts
 * type User = {
 *  info: { name: string; age: number; payment: {} }
 *  id: number
 * }
 *
 * type test0 = At<User, 'id'> // number
 * ```
 */
declare type At<A, K extends string | number | symbol> = unknown extends A ? unknown : K extends keyof A ? A[K] : undefined;
declare type MergeObjectDeeply<O extends Record<string | number | symbol, unknown>, O1 extends Record<string | number | symbol, unknown>> = {
    [K in keyof (Anyfy<O> & O1)]: K extends keyof O1 ? MergeObjectOrReturnValue<At<O, K>, At<O1, K>> : O[K];
};
declare type MergeObjectOrReturnValue<OK, O1K> = [O1K] extends [never] ? OK : OK extends Record<string | number | symbol, unknown> ? O1K extends Record<string | number | symbol, unknown> ? MergeObjectDeeply<OK, O1K> : O1K : O1K;
/**
 * Accurately merge the fields of `O` with the ones of `O1`. It is
 * equivalent to the spread operator in JavaScript. [[Union]]s and [[Optional]]
 * fields will be handled gracefully.
 *
 * (⚠️ needs `--strictNullChecks` enabled)
 * @param O to complete
 * @param O1 to copy from
 * @returns [[Object]]
 * @example
 * ```ts
 * type O = {
 *   name?: string
 *   age?: number
 *   zip?: string
 *   pay: { cvv?: number }
 * }
 *
 * type O1 = {
 *   age: number
 *   zip?: number
 *   pay: { cvv : number; ccn?: string }
 *   city: string
 * }
 *
 * type test = MergeDeep<O, O1>
 * // {
 * //     name?: string;
 * //     age: number;
 * //     zip: number | undefined;
 * //     pay: {
 * //         cvv: number;
 * //         ccn?: string;
 * //     };
 * //     city: string;
 * // }
 * ```
 */
export declare type MergeDeep<O extends object, O1 extends object> = O extends unknown ? O1 extends unknown ? MergeObjectOrReturnValue<O, O1> : never : never;
export {};
