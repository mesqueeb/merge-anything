/**
 * Get the keys of `O` that are optional
 * @param O
 * @returns [[Key]]
 * @example
 * ```ts
 * ```
 */
type OptionalKeys<O extends object> = O extends unknown ? {
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
type RequiredKeys<O extends object> = O extends unknown ? {
    [K in keyof O]-?: {} extends Pick<O, K> ? never : K;
}[keyof O] : never;
type MergeObjectDeeply<O extends Record<string | number | symbol, unknown>, O1 extends Record<string | number | symbol, unknown>> = {
    [K in keyof (O & O1)]: K extends RequiredKeys<O1> ? MergeObjectsOrReturnFallback<O[K], O1[K], O1[K]> : K extends OptionalKeys<O1> ? K extends OptionalKeys<O> ? MergeObjectsOrReturnFallback<Exclude<O[K], undefined>, Exclude<O1[K], undefined>, Exclude<O[K], undefined> | Exclude<O1[K], undefined>> : K extends RequiredKeys<O> ? Exclude<O1[K], undefined> extends O[K] ? O[K] : MergeObjectsOrReturnFallback<O[K], Exclude<O1[K], undefined>, O[K] | Exclude<O1[K], undefined>> : O1[K] : O[K];
};
type MergeObjectsOrReturnFallback<O, O1, Fallback> = O extends Record<string | number | symbol, unknown> ? O1 extends Record<string | number | symbol, unknown> ? MergeObjectDeeply<O, O1> : Fallback : Fallback;
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
 * import { PrettyPrint } from './PrettyPrint'
 *
 * type A1 = { a: number; b?: number;            d?: number; e?: number; x: string;             y?: number; z: string;  } // prettier-ignore
 * type A2 = { a?: number;           c?: number; d?: number; e: number;  x: number | undefined; y?: string; z?: number; } // prettier-ignore
 *
 * type Result = PrettyPrint<MergeDeep<A1, A2>>
 * {
 *    a: number;
 *    b?: number | undefined;
 *    c?: number | undefined;
 *    d?: number | undefined;
 *    e: number;
 *    x: number | undefined;
 *    y?: string | number | undefined;
 *    z: string | number;
 * }
 * ```
 */
type MergeDeep<O extends Record<string | number | symbol, unknown>, O1 extends Record<string | number | symbol, unknown>> = O extends unknown ? (O1 extends unknown ? MergeObjectDeeply<O, O1> : never) : never;

/**
 * An entry of `IterationMap`
 */
type Iteration = [
    value: number,
    sign: '-' | '0' | '+',
    prev: keyof IterationMap,
    next: keyof IterationMap,
    oppo: keyof IterationMap
];
type IterationMap = {
    '__': [number, '-' | '0' | '+', '__', '__', '__'];
    '-100': [-100, '-', '__', '-99', '100'];
    '-99': [-99, '-', '-100', '-98', '99'];
    '-98': [-98, '-', '-99', '-97', '98'];
    '-97': [-97, '-', '-98', '-96', '97'];
    '-96': [-96, '-', '-97', '-95', '96'];
    '-95': [-95, '-', '-96', '-94', '95'];
    '-94': [-94, '-', '-95', '-93', '94'];
    '-93': [-93, '-', '-94', '-92', '93'];
    '-92': [-92, '-', '-93', '-91', '92'];
    '-91': [-91, '-', '-92', '-90', '91'];
    '-90': [-90, '-', '-91', '-89', '90'];
    '-89': [-89, '-', '-90', '-88', '89'];
    '-88': [-88, '-', '-89', '-87', '88'];
    '-87': [-87, '-', '-88', '-86', '87'];
    '-86': [-86, '-', '-87', '-85', '86'];
    '-85': [-85, '-', '-86', '-84', '85'];
    '-84': [-84, '-', '-85', '-83', '84'];
    '-83': [-83, '-', '-84', '-82', '83'];
    '-82': [-82, '-', '-83', '-81', '82'];
    '-81': [-81, '-', '-82', '-80', '81'];
    '-80': [-80, '-', '-81', '-79', '80'];
    '-79': [-79, '-', '-80', '-78', '79'];
    '-78': [-78, '-', '-79', '-77', '78'];
    '-77': [-77, '-', '-78', '-76', '77'];
    '-76': [-76, '-', '-77', '-75', '76'];
    '-75': [-75, '-', '-76', '-74', '75'];
    '-74': [-74, '-', '-75', '-73', '74'];
    '-73': [-73, '-', '-74', '-72', '73'];
    '-72': [-72, '-', '-73', '-71', '72'];
    '-71': [-71, '-', '-72', '-70', '71'];
    '-70': [-70, '-', '-71', '-69', '70'];
    '-69': [-69, '-', '-70', '-68', '69'];
    '-68': [-68, '-', '-69', '-67', '68'];
    '-67': [-67, '-', '-68', '-66', '67'];
    '-66': [-66, '-', '-67', '-65', '66'];
    '-65': [-65, '-', '-66', '-64', '65'];
    '-64': [-64, '-', '-65', '-63', '64'];
    '-63': [-63, '-', '-64', '-62', '63'];
    '-62': [-62, '-', '-63', '-61', '62'];
    '-61': [-61, '-', '-62', '-60', '61'];
    '-60': [-60, '-', '-61', '-59', '60'];
    '-59': [-59, '-', '-60', '-58', '59'];
    '-58': [-58, '-', '-59', '-57', '58'];
    '-57': [-57, '-', '-58', '-56', '57'];
    '-56': [-56, '-', '-57', '-55', '56'];
    '-55': [-55, '-', '-56', '-54', '55'];
    '-54': [-54, '-', '-55', '-53', '54'];
    '-53': [-53, '-', '-54', '-52', '53'];
    '-52': [-52, '-', '-53', '-51', '52'];
    '-51': [-51, '-', '-52', '-50', '51'];
    '-50': [-50, '-', '-51', '-49', '50'];
    '-49': [-49, '-', '-50', '-48', '49'];
    '-48': [-48, '-', '-49', '-47', '48'];
    '-47': [-47, '-', '-48', '-46', '47'];
    '-46': [-46, '-', '-47', '-45', '46'];
    '-45': [-45, '-', '-46', '-44', '45'];
    '-44': [-44, '-', '-45', '-43', '44'];
    '-43': [-43, '-', '-44', '-42', '43'];
    '-42': [-42, '-', '-43', '-41', '42'];
    '-41': [-41, '-', '-42', '-40', '41'];
    '-40': [-40, '-', '-41', '-39', '40'];
    '-39': [-39, '-', '-40', '-38', '39'];
    '-38': [-38, '-', '-39', '-37', '38'];
    '-37': [-37, '-', '-38', '-36', '37'];
    '-36': [-36, '-', '-37', '-35', '36'];
    '-35': [-35, '-', '-36', '-34', '35'];
    '-34': [-34, '-', '-35', '-33', '34'];
    '-33': [-33, '-', '-34', '-32', '33'];
    '-32': [-32, '-', '-33', '-31', '32'];
    '-31': [-31, '-', '-32', '-30', '31'];
    '-30': [-30, '-', '-31', '-29', '30'];
    '-29': [-29, '-', '-30', '-28', '29'];
    '-28': [-28, '-', '-29', '-27', '28'];
    '-27': [-27, '-', '-28', '-26', '27'];
    '-26': [-26, '-', '-27', '-25', '26'];
    '-25': [-25, '-', '-26', '-24', '25'];
    '-24': [-24, '-', '-25', '-23', '24'];
    '-23': [-23, '-', '-24', '-22', '23'];
    '-22': [-22, '-', '-23', '-21', '22'];
    '-21': [-21, '-', '-22', '-20', '21'];
    '-20': [-20, '-', '-21', '-19', '20'];
    '-19': [-19, '-', '-20', '-18', '19'];
    '-18': [-18, '-', '-19', '-17', '18'];
    '-17': [-17, '-', '-18', '-16', '17'];
    '-16': [-16, '-', '-17', '-15', '16'];
    '-15': [-15, '-', '-16', '-14', '15'];
    '-14': [-14, '-', '-15', '-13', '14'];
    '-13': [-13, '-', '-14', '-12', '13'];
    '-12': [-12, '-', '-13', '-11', '12'];
    '-11': [-11, '-', '-12', '-10', '11'];
    '-10': [-10, '-', '-11', '-9', '10'];
    '-9': [-9, '-', '-10', '-8', '9'];
    '-8': [-8, '-', '-9', '-7', '8'];
    '-7': [-7, '-', '-8', '-6', '7'];
    '-6': [-6, '-', '-7', '-5', '6'];
    '-5': [-5, '-', '-6', '-4', '5'];
    '-4': [-4, '-', '-5', '-3', '4'];
    '-3': [-3, '-', '-4', '-2', '3'];
    '-2': [-2, '-', '-3', '-1', '2'];
    '-1': [-1, '-', '-2', '0', '1'];
    '0': [0, '0', '-1', '1', '0'];
    '1': [1, '+', '0', '2', '-1'];
    '2': [2, '+', '1', '3', '-2'];
    '3': [3, '+', '2', '4', '-3'];
    '4': [4, '+', '3', '5', '-4'];
    '5': [5, '+', '4', '6', '-5'];
    '6': [6, '+', '5', '7', '-6'];
    '7': [7, '+', '6', '8', '-7'];
    '8': [8, '+', '7', '9', '-8'];
    '9': [9, '+', '8', '10', '-9'];
    '10': [10, '+', '9', '11', '-10'];
    '11': [11, '+', '10', '12', '-11'];
    '12': [12, '+', '11', '13', '-12'];
    '13': [13, '+', '12', '14', '-13'];
    '14': [14, '+', '13', '15', '-14'];
    '15': [15, '+', '14', '16', '-15'];
    '16': [16, '+', '15', '17', '-16'];
    '17': [17, '+', '16', '18', '-17'];
    '18': [18, '+', '17', '19', '-18'];
    '19': [19, '+', '18', '20', '-19'];
    '20': [20, '+', '19', '21', '-20'];
    '21': [21, '+', '20', '22', '-21'];
    '22': [22, '+', '21', '23', '-22'];
    '23': [23, '+', '22', '24', '-23'];
    '24': [24, '+', '23', '25', '-24'];
    '25': [25, '+', '24', '26', '-25'];
    '26': [26, '+', '25', '27', '-26'];
    '27': [27, '+', '26', '28', '-27'];
    '28': [28, '+', '27', '29', '-28'];
    '29': [29, '+', '28', '30', '-29'];
    '30': [30, '+', '29', '31', '-30'];
    '31': [31, '+', '30', '32', '-31'];
    '32': [32, '+', '31', '33', '-32'];
    '33': [33, '+', '32', '34', '-33'];
    '34': [34, '+', '33', '35', '-34'];
    '35': [35, '+', '34', '36', '-35'];
    '36': [36, '+', '35', '37', '-36'];
    '37': [37, '+', '36', '38', '-37'];
    '38': [38, '+', '37', '39', '-38'];
    '39': [39, '+', '38', '40', '-39'];
    '40': [40, '+', '39', '41', '-40'];
    '41': [41, '+', '40', '42', '-41'];
    '42': [42, '+', '41', '43', '-42'];
    '43': [43, '+', '42', '44', '-43'];
    '44': [44, '+', '43', '45', '-44'];
    '45': [45, '+', '44', '46', '-45'];
    '46': [46, '+', '45', '47', '-46'];
    '47': [47, '+', '46', '48', '-47'];
    '48': [48, '+', '47', '49', '-48'];
    '49': [49, '+', '48', '50', '-49'];
    '50': [50, '+', '49', '51', '-50'];
    '51': [51, '+', '50', '52', '-51'];
    '52': [52, '+', '51', '53', '-52'];
    '53': [53, '+', '52', '54', '-53'];
    '54': [54, '+', '53', '55', '-54'];
    '55': [55, '+', '54', '56', '-55'];
    '56': [56, '+', '55', '57', '-56'];
    '57': [57, '+', '56', '58', '-57'];
    '58': [58, '+', '57', '59', '-58'];
    '59': [59, '+', '58', '60', '-59'];
    '60': [60, '+', '59', '61', '-60'];
    '61': [61, '+', '60', '62', '-61'];
    '62': [62, '+', '61', '63', '-62'];
    '63': [63, '+', '62', '64', '-63'];
    '64': [64, '+', '63', '65', '-64'];
    '65': [65, '+', '64', '66', '-65'];
    '66': [66, '+', '65', '67', '-66'];
    '67': [67, '+', '66', '68', '-67'];
    '68': [68, '+', '67', '69', '-68'];
    '69': [69, '+', '68', '70', '-69'];
    '70': [70, '+', '69', '71', '-70'];
    '71': [71, '+', '70', '72', '-71'];
    '72': [72, '+', '71', '73', '-72'];
    '73': [73, '+', '72', '74', '-73'];
    '74': [74, '+', '73', '75', '-74'];
    '75': [75, '+', '74', '76', '-75'];
    '76': [76, '+', '75', '77', '-76'];
    '77': [77, '+', '76', '78', '-77'];
    '78': [78, '+', '77', '79', '-78'];
    '79': [79, '+', '78', '80', '-79'];
    '80': [80, '+', '79', '81', '-80'];
    '81': [81, '+', '80', '82', '-81'];
    '82': [82, '+', '81', '83', '-82'];
    '83': [83, '+', '82', '84', '-83'];
    '84': [84, '+', '83', '85', '-84'];
    '85': [85, '+', '84', '86', '-85'];
    '86': [86, '+', '85', '87', '-86'];
    '87': [87, '+', '86', '88', '-87'];
    '88': [88, '+', '87', '89', '-88'];
    '89': [89, '+', '88', '90', '-89'];
    '90': [90, '+', '89', '91', '-90'];
    '91': [91, '+', '90', '92', '-91'];
    '92': [92, '+', '91', '93', '-92'];
    '93': [93, '+', '92', '94', '-93'];
    '94': [94, '+', '93', '95', '-94'];
    '95': [95, '+', '94', '96', '-95'];
    '96': [96, '+', '95', '97', '-96'];
    '97': [97, '+', '96', '98', '-97'];
    '98': [98, '+', '97', '99', '-98'];
    '99': [99, '+', '98', '100', '-99'];
    '100': [100, '+', '99', '__', '-100'];
};
/**
 * Transform a number into an [[Iteration]]
 * (to use [[Prev]], [[Next]], & [[Pos]])
 * @param N to transform
 * @returns [[Iteration]]
 * @example
 * ```ts
 * type i = IterationOf<0> // ["-1", "1", "0", 0, "0"]
 *
 * type next = Next<i>       // ["0", "2", "1", 1, "+"]
 * type prev = Prev<i>       // ["-2", "0", "-1", -1, "-"]
 *
 * type nnext = Pos<next>    // +1
 * type nprev = Pos<prev>    // -1
 * ```
 */
type IterationOf<N extends number> = `${N}` extends keyof IterationMap ? IterationMap[`${N}`] : IterationMap['__'];
/**
 * Get the position of `I` (**number**)
 * @param I to query
 * @returns `number`
 * @example
 * ```ts
 * type i = IterationOf<'20'>
 *
 * type test0 = Pos<i>         // 20
 * type test1 = Pos<Next<i>> // 21
 * ```
 */
type Pos<I extends Iteration> = I[0];
/**
 * Move `I`'s position forward
 * @param I to move
 * @returns [[Iteration]]
 * @example
 * ```ts
 * type i = IterationOf<'20'>
 *
 * type test0 = Pos<i>         // 20
 * type test1 = Pos<Next<i>> // 21
 * ```
 */
type Next<I extends Iteration> = IterationMap[I[3]];

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
type List<T = any> = readonly T[];
/**
 * Get the length of `L`
 * @param L to get length
 * @returns [[String]] or `number`
 * @example
 * ```ts
 * ```
 */
type Length<L extends List> = L['length'];
/**
 * Return the last item out of a [[List]]
 * @param L
 * @returns [[List]]
 * @example
 * ```ts
 * ```
 */
type Pop<L extends List> = L extends readonly [] ? never : L extends [...unknown[], infer Last] ? Last : L extends (infer T)[] ? T : never;

/**
 * Ask TS to re-check that `A1` extends `A2`.
 * And if it fails, `A2` will be enforced anyway.
 * Can also be used to add constraints on parameters.
 * @param A1 to check against
 * @param A2 to cast to
 * @returns `A1 | A2`
 * @example
 * ```ts
 * type test0 = Cast<'42', string> // '42'
 * type test1 = Cast<'42', number> // number
 * ```
 */
type Cast<A1, A2> = A1 extends A2 ? A1 : A2;
/**
 * Check whether `A1` is part of `A2` or not. The difference with
 * `extends` is that it forces a [[Boolean]] return.
 * @param A1
 * @param A2
 * @returns [[Boolean]]
 * @example
 * ```ts
 * type test0 = Extends<'a' | 'b', 'b'> // Boolean
 * type test1 = Extends<'a', 'a' | 'b'> // True
 *
 * type test2 = Extends<{a: string}, {a: any}>      // True
 * type test3 = Extends<{a: any}, {a: any, b: any}> // False
 *
 * type test4 = Extends<never, never> // False
 * /// Nothing cannot extend nothing, use `Equals`
 * ```
 */
type Extends<A1, A2> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
type __Assign<O extends Record<string | number | symbol, unknown>, Os extends List<Record<string | number | symbol, unknown>>, I extends Iteration = IterationOf<0>> = Extends<Pos<I>, Length<Os>> extends 1 ? O : __Assign<MergeDeep<O, Os[Pos<I>]>, Os, Next<I>>;
type _Assign<O extends Record<string | number | symbol, unknown>, Os extends List<Record<string | number | symbol, unknown>>> = __Assign<O, Os> extends infer X ? Cast<X, Record<string | number | symbol, unknown>> : never;
/**
 * Assign a list of [[Object]] into `O` with [[MergeDeep]]. Merges from right to
 * left, first items get overridden by the next ones (last-in overrides).
 * @param O to assign to
 * @param Os to assign
 * @returns [[Object]]
 * @example
 * ```ts
 * ```
 */
type Assign<O extends Record<string | number | symbol, unknown>, Os extends List<Record<string | number | symbol, unknown>>> = O extends unknown ? (Os extends unknown ? _Assign<O, Os> : never) : never;

type Has<U, U1> = [U1] extends [U] ? 1 : 0;
type If<B extends 0 | 1, Then, Else = never> = B extends 1 ? Then : Else;
type PrettyPrint<A, Seen = never> = If<Has<Seen, A>, A, A extends Record<string | number | symbol, unknown> ? {
    [K in keyof A]: PrettyPrint<A[K], A | Seen>;
} & unknown : A>;

/**
 * The return type of `merge()`. It reflects the type that is returned by JavaScript.
 *
 * This TS Utility can be used as standalone as well
 */
type Merge<T, Ts extends unknown[]> = T extends Record<string | number | symbol, unknown> ? Ts extends Record<string | number | symbol, unknown>[] ? PrettyPrint<Assign<T, Ts>> : Pop<Ts> : Pop<Ts>;
/**
 * Merge anything recursively.
 * Objects get merged, special objects (classes etc.) are re-assigned "as is".
 * Basic types overwrite objects or other basic types.
 */
declare function merge<T, Tn extends unknown[]>(object: T, ...otherObjects: Tn): Merge<T, Tn>;
declare function mergeAndCompare<T, Tn extends unknown[]>(compareFn: (prop1: any, prop2: any, propName: string | symbol) => any, object: T, ...otherObjects: Tn): Merge<T, Tn>;
declare function mergeAndConcat<T, Tn extends unknown[]>(object: T, ...otherObjects: Tn): Merge<T, Tn>;

declare function concatArrays(originVal: any, newVal: any): any | any[];

export { Merge, concatArrays, merge, mergeAndCompare, mergeAndConcat };
