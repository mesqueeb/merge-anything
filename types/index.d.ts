declare type Extension = (param1: any, param2: any) => any;
interface IConfig {
    extensions: Extension[];
}
/**
 * Merge anything recursively. objects get merged, basic types overwrite objects or other basic types.
 *
 * @param {(IConfig | any)} origin
 * @param {...any[]} newComers
 * @returns the result
 */
export default function (origin: IConfig | any, ...newComers: any[]): any;
export {};
