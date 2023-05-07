import { test, expect } from 'vitest'
import { isArray } from 'is-what'
import { mergeAndCompare, merge } from '../src/index'

function mergeArrays(originVal: any, newVal: any): any | any[] {
  if (isArray(originVal) && isArray(newVal)) {
    // concat & merge logic
    const overlappingPart = originVal.slice(0, newVal.length)

    return overlappingPart
      .map((p, i) => (newVal[i] ? merge(p, newVal[i]) : p))
      .concat(
        newVal.length > originVal.length
          ? originVal.slice(newVal.length)
          : newVal.slice(originVal.length)
      )
  }
  return newVal // always return newVal as fallback!!
}

test('undefined object', () => {
  const origin = {
    pages: {
      aa: 'ttt',
    },
  }

  const newData = {
    pages: {
      aa: '1111',
      bb: '2222',
    },
  }

  const res = mergeAndCompare(mergeArrays, origin, newData)
  expect(res as any).toEqual({ pages: { aa: '1111', bb: '2222' } })
})

test('undefined array', () => {
  const origin = {
    date: [
      {
        new: 'aa',
        something: 'yy',
      },
    ],
  }
  const target = {
    date: [
      {
        new: 'bb',
        old: 'zz',
      },
    ],
  }
  const res = mergeAndCompare(mergeArrays, origin, target)
  expect(res as any).toEqual({
    date: [
      {
        new: 'bb',
        something: 'yy',
        old: 'zz',
      },
    ],
  })
})
