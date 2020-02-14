import { O } from 'ts-toolbelt';
declare type PlainObject = {
    [key: string | symbol]: any;
};
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
export declare function merge<T extends PlainObject, Tn extends PlainObject[]>(origin: T, ...newComers: Tn): O.Assign<T, Tn, 'deep'>;
export declare function mergeAndCompare<T extends PlainObject, Tn extends PlainObject[]>(compareFn: (prop1: any, prop2: any, propName: string | symbol) => any, origin: T, ...newComers: Tn): O.Assign<T, Tn, 'deep'>;
export declare function mergeAndConcat<T extends PlainObject, Tn extends PlainObject[]>(origin: T, ...newComers: Tn): O.Assign<T, Tn, 'deep'>;
export {};
