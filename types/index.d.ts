declare type Extension = (param1: any, param2: any) => any;
interface config {
    extensions: Extension[];
}
/**
 * Merge anything recursively. objects get merged, basic types overwrite objects or other basic types.
 *
 * @param {(config | any)} origin
 * @param {...any[]} newComers
 * @returns the result
 */
declare function merge(origin: config | any, ...newComers: any[]): any;
export default merge;
