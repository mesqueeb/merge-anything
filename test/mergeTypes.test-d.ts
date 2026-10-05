import { expectTypeOf, test } from 'vitest'
import { merge, mergeAndCompare, mergeAndConcat, type Merge } from '../src/index.js'

interface User {
  readonly id: number
  name?: string
}

class Counter {
  constructor(readonly value: number) {}
}

type Brand = string & { readonly __brand: 'Brand' }
type Empty<T> = Merge<T, []>

const user: User = { id: 1 }
declare const scalar: 'origin'
const unknownValue: unknown = { source: true }
declare const nullable: Date | null | undefined
const readonlyTuple = ['a', 1] as const
const readonlyArray: readonly string[] = ['a']
declare const branded: Brand
declare const union: User | Date
const callback = (_left: unknown, _right: unknown, _key: string | symbol): unknown => undefined

test('empty updates preserve the origin type', () => {
  expectTypeOf(merge(user)).toEqualTypeOf<User>()
  expectTypeOf(merge(scalar)).toEqualTypeOf<'origin'>()
  expectTypeOf(merge(unknownValue)).toEqualTypeOf<unknown>()
  expectTypeOf(merge(nullable)).toEqualTypeOf<Date | null | undefined>()
  expectTypeOf(merge(readonlyArray)).toEqualTypeOf<readonly string[]>()
  expectTypeOf(merge(readonlyTuple)).toEqualTypeOf<readonly ['a', 1]>()
  expectTypeOf(merge(new Date())).toEqualTypeOf<Date>()
  expectTypeOf(merge(/x/)).toEqualTypeOf<RegExp>()
  expectTypeOf(merge(new Map<string, number>())).toEqualTypeOf<Map<string, number>>()
  expectTypeOf(merge(new Set<number>())).toEqualTypeOf<Set<number>>()
  const fnCheck: () => number = merge(() => 1)
  expectTypeOf(merge(new Counter(1))).toEqualTypeOf<Counter>()
  expectTypeOf(merge(branded)).toEqualTypeOf<Brand>()
  expectTypeOf(merge(union)).toEqualTypeOf<User | Date>()

  expectTypeOf(mergeAndCompare(callback, user)).toEqualTypeOf<User>()
  expectTypeOf(mergeAndCompare(callback, new Date())).toEqualTypeOf<Date>()
  expectTypeOf(mergeAndConcat(user)).toEqualTypeOf<User>()
  expectTypeOf(mergeAndConcat(readonlyArray)).toEqualTypeOf<readonly string[]>()

  expectTypeOf<Empty<User>>().toEqualTypeOf<User>()
  expectTypeOf<Empty<Date>>().toEqualTypeOf<Date>()
  expectTypeOf<Empty<unknown>>().toEqualTypeOf<unknown>()

  const mergedUser = merge(user)
  mergedUser.id satisfies number
  // @ts-expect-error Wrong assignments must remain rejected for an empty update.
  mergedUser.id = 'wrong'
  // @ts-expect-error Wrong assignments must remain rejected for an empty update.
  const wrongUser: User = merge({ id: 'wrong' })

  // @ts-expect-error A string result cannot be assigned to Date.
  const wrongDate: Date = merge('text')

  // @ts-expect-error The initial object is required.
  merge()

  // Non-empty object updates keep the established merge typing.
  const nonEmptyObject = merge({ id: 1 }, { name: 'Ada' })
  nonEmptyObject.id satisfies number
  const nonEmptyArray = merge([1, 2] as const, [3] as const)
  nonEmptyArray satisfies readonly [3]
})
