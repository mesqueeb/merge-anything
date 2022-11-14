import type { Assign } from './typeUtils/Assign';
import type { List } from './typeUtils/List';
import type { PrettyPrint } from './typeUtils/PrettyPrint';
/**
 * The return type of `merge()`. It reflects the type that is returned by JavaScript.
 *
 * This TS Utility can be used as standalone as well
 */
export declare type Merge<T extends object, Ts extends List<object>> = PrettyPrint<Assign<T, Ts>>;
/**
 * Merge anything recursively.
 * Objects get merged, special objects (classes etc.) are re-assigned "as is".
 * Basic types overwrite objects or other basic types.
 */
export declare function merge<T extends Record<string | number | symbol, unknown>, Tn extends Record<string | number | symbol, unknown>[]>(object: T, ...otherObjects: Tn): Merge<T, Tn>;
export declare function mergeAndCompare<T extends Record<string | number | symbol, unknown>, Tn extends Record<string | number | symbol, unknown>[]>(compareFn: (prop1: any, prop2: any, propName: string | symbol) => any, object: T, ...otherObjects: Tn): Merge<T, Tn>;
export declare function mergeAndConcat<T extends Record<string | number | symbol, unknown>, Tn extends Record<string | number | symbol, unknown>[]>(object: T, ...otherObjects: Tn): Merge<T, Tn>;
