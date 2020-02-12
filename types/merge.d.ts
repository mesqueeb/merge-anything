import { Object as ObjectTs } from 'ts-toolbelt';
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
export declare function merge<T extends PlainObject, Tn extends PlainObject[]>(origin: T, ...newComers: Tn): ObjectTs.Assign<T, Tn>;
export {};
