export {};
// import { PrettyPrint } from './PrettyPrint'
// type A1 = { arr: string[]; barr?: { b: number } }
// type A2 = { arr?: number[]; barr?: { b: number } }
// type TestA = PrettyPrint<MergeDeep<A1, A2>>
// type B1 = { a: number; b?: number;            d?: number; e?: number; x: string;             y?: number; z: string;  } // prettier-ignore
// type B2 = { a?: number;           c?: number; d?: number; e: number;  x: number | undefined; y?: string; z?: number; } // prettier-ignore
// type TestB = PrettyPrint<MergeDeep<B1, B2>>
// type C1 = { info: { time: string; newDate: Date; very: { deep: { prop: boolean } } } }
// type C2 = { info: { date: string; very: { deep: { prop: boolean } } } }
// type TestC = PrettyPrint<MergeDeep<C1, C2>>
// type D1 = { [key in string]?: { cool: boolean } | null }
// type D2 = { [key in string]?: { notCool: boolean } | null }
// type TestD = PrettyPrint<MergeDeep<D1, D2>>
// import { Timestamp } from '../../test/Timestamp'
// type T1 = { date: Timestamp }
// type T2 = { date: Timestamp }
// type TestT = MergeDeep<T1, T2>
// interface I1 { date: Timestamp }
// interface I2 { date: Timestamp }
// type TestI = MergeDeep<I1, I2>
