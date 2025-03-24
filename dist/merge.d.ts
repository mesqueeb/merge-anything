import type { Assign } from './typeUtils/Assign.js';
import type { Pop } from './typeUtils/List.js';
import type { PrettyPrint } from './typeUtils/PrettyPrint.js';
/**
 * The return type of `merge()`. It reflects the type that is returned by JavaScript.
 *
 * This TS Utility can be used as standalone as well
 */
export type Merge<T, Ts extends unknown[]> = T extends Record<string | number | symbol, unknown> ? Ts extends Record<string | number | symbol, unknown>[] ? PrettyPrint<Assign<T, Ts>> : Pop<Ts> : Pop<Ts>;
/**
 * Merge anything recursively. Objects get merged, special objects (classes etc.) are re-assigned
 * "as is". Basic types overwrite objects or other basic types.
 */
export declare function merge<T, const Tn extends unknown[]>(object: T, ...otherObjects: Tn): Merge<T, Tn>;
export declare function mergeAndCompare<T, const Tn extends unknown[]>(compareFn: (prop1: unknown, prop2: unknown, propName: string | symbol) => any, object: T, ...otherObjects: Tn): Merge<T, Tn>;
export declare function mergeAndConcat<T, const Tn extends unknown[]>(object: T, ...otherObjects: Tn): Merge<T, Tn>;
