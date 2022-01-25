import { test, expect } from 'vitest'
import { mergeAndConcat } from '../src/index'

test('mergeAndConcat', () => {
  const origin = {
    someArray: ['a'],
    a: { b: { c: ['x'] } },
  }
  const target = {
    someArray: ['b'],
    a: { b: { c: ['y'] } },
  }
  const res = mergeAndConcat(origin, target)
  t.deepEqual(res, { someArray: ['a', 'b'], a: { b: { c: ['x', 'y'] } } })
})
