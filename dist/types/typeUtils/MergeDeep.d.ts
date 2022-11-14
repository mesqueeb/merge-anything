/**
 * Get the keys of `O` that are optional
 * @param O
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
declare type OptionalKeys<O extends object> = O extends unknown ? {
    [K in keyof O]-?: {} extends Pick<O, K> ? K : never;
}[keyof O] : never;
/**
 * Get the keys of `O` that are required
 * @param O
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
declare type RequiredKeys<O extends object> = O extends unknown ? {
    [K in keyof O]-?: {} extends Pick<O, K> ? never : K;
}[keyof O] : never;
declare type MergeObjectDeeply<O extends Record<string | number | symbol, unknown>, O1 extends Record<string | number | symbol, unknown>> = {
    [K in keyof (O & O1)]: K extends RequiredKeys<O1> ? O1[K] : K extends OptionalKeys<O1> ? K extends OptionalKeys<O> ? MergeObjectOrReturnUnion<Exclude<O[K], undefined>, Exclude<O1[K], undefined>> : K extends RequiredKeys<O> ? Exclude<O1[K], undefined> extends O[K] ? O[K] : MergeObjectOrReturnUnion<O[K], Exclude<O1[K], undefined>> : O1[K] : O[K];
};
declare type MergeObjectOrReturnUnion<Val0, Val1> = Val0 extends Record<string | number | symbol, unknown> ? Val1 extends Record<string | number | symbol, unknown> ? MergeObjectDeeply<Val0, Val1> : Val0 | Val1 : Val0 | Val1;
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
export declare type MergeDeep<O extends Record<string | number | symbol, unknown>, O1 extends Record<string | number | symbol, unknown>> = O extends unknown ? (O1 extends unknown ? MergeObjectDeeply<O, O1> : never) : never;
export {};
