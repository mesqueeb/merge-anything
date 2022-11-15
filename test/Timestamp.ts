export declare class Timestamp {
  readonly seconds: number
  readonly nanoseconds: number
  static now(): Timestamp
  static fromDate(date: Date): Timestamp
  static fromMillis(milliseconds: number): Timestamp
  constructor(seconds: number, nanoseconds: number)
  toDate(): Date
  toMillis(): number
  isEqual(other: Timestamp): boolean
  toString(): string
  toJSON(): {
    seconds: number
    nanoseconds: number
  }
  valueOf(): string
}

// interface Obj {
//   string: any
// }

// type T = Timestamp extends Record<string | number | symbol, unknown> ? 1 : 0
// type O = Obj extends Obj ? 1 : 0
