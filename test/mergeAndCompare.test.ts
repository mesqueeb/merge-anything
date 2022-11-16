import { test, expect } from 'vitest'
import { isDate, isString, isArray } from 'is-what'
import { mergeAndCompare } from '../src/index'

test('conversion based on original val', () => {
  function convertTimestamps(originVal: any, targetVal: any) {
    if (originVal === '%convertTimestamp%' && isString(targetVal) && isDate(new Date(targetVal))) {
      return new Date(targetVal)
    }
    return targetVal
  }
  const origin = {
    date: '%convertTimestamp%',
  }
  const target = {
    date: '1990-06-22',
  }
  const res = mergeAndCompare(convertTimestamps, origin, target)
  expect(res as any).toEqual({ date: new Date('1990-06-22') })
  // doesn't work on base lvl anymore
  // const res2 = mergeAndCompare(convertTimestamps, '%convertTimestamp%', '1990-06-22')
  // expect(res2).toEqual( new Date('1990-06-22'))
})
test('conversion based on prop key', () => {
  function convertTimestamps(originVal: any, targetVal: any, key: any) {
    if (isString(targetVal) && key === 'date') {
      return new Date(targetVal)
    }
    return targetVal
  }
  const origin = {
    date: '%convertTimestamp%',
    a: {},
  }
  const target = {
    date: '1990-06-22',
    a: { date: '1990-01-01' },
  }
  const res = mergeAndCompare(convertTimestamps, origin, target)
  expect(res as any).toEqual({ date: new Date('1990-06-22'), a: { date: new Date('1990-01-01') } })
})
test('Extend with custom concat arrays', () => {
  function concatArr(originVal: any, targetVal: any) {
    if (isArray(originVal) && isArray(targetVal)) {
      return originVal.concat(targetVal)
    }
    return targetVal
  }
  const origin = {
    someArray: ['a'],
    a: { b: { c: ['x'] } },
  }
  const target = {
    someArray: ['b'],
    a: { b: { c: ['y'] } },
  }
  const res = mergeAndCompare(concatArr, origin, target)
  expect(res).toEqual({ someArray: ['a', 'b'], a: { b: { c: ['x', 'y'] } } })
  // doesn't work on base lvl anymore
  // const res2 = mergeAndCompare(concatArr, ['a'], ['b'])
  // expect(res2).toEqual( ['a', 'b'])
})

test('undefined object', () => {
  const origin = {
    pages: {
      'aa': 'ttt',
    },
  }

  const newData = {
    pages: {
      'aa': '1111',
      'bb': '2222',
    }
  }

  function convertTimestamps(originVal: any, targetVal: any, key: any) {
    if (originVal !== undefined)
      return targetVal
  }

  const res = mergeAndCompare(convertTimestamps, origin, newData)
  expect(res as any).toEqual({ pages: { aa: "1111", bb: undefined } })
})

test('undefined array', () => {
  function convertTimestamps(originVal: any, targetVal: any, key: any) {
    if (originVal !== undefined)
      return targetVal
  }
  const origin = {
    date: [
      {
        'new': 'aaa',
      }
    ]
  }
  const target = {
    date: [
      {
        'new': 'aaa',
        'old': 'bbb',
      }
    ]
  }
  const res = mergeAndCompare(convertTimestamps, origin, target)
  expect(res as any).toEqual({
    date: [
      {
        'new': 'aaa',
        'old': undefined,
      }
    ]
  })
})