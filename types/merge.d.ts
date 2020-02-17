import { O } from 'ts-toolbelt';
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
export declare function merge<T extends object, Tn extends object[]>(origin: T, ...newComers: Tn): O.Compact<T, Tn, 'deep'>;
export declare function mergeAndCompare<T extends object, Tn extends object[]>(compareFn: (prop1: any, prop2: any, propName: string | symbol) => any, origin: T, ...newComers: Tn): O.Compact<T, Tn, 'deep'>;
export declare function mergeAndConcat<T extends object, Tn extends object[]>(origin: T, ...newComers: Tn): O.Compact<T, Tn, 'deep'>;
