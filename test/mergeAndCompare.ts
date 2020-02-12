import test from 'ava'
// import { isDate, isString, isArray, isObject } from 'is-what'
// import { merge, concatArrays } from '../src/index'

// function cloneFn (originVal, targetVal) {
//   if (isObject(targetVal)) return JSON.parse(JSON.stringify(targetVal))
//   return targetVal
// }

test('.', t => t.pass())

// test('origin and target are not modified - with completely different props', t => {
//   // extend to clone vals
//   const origin = { body: '', head: null, toes: { big: true }, fingers: { '12': false } }
//   const target = { a: 'a', b: 'b', c: { d: { e: 'e' } } }
//   const res = merge({ extensions: [cloneFn] }, origin, target)
//   t.deepEqual(res, {
//     body: '',
//     head: null,
//     toes: { big: true },
//     fingers: { '12': false },
//     a: 'a',
//     b: 'b',
//     c: { d: { e: 'e' } },
//   })
//   t.deepEqual(origin, { body: '', head: null, toes: { big: true }, fingers: { '12': false } })
//   t.deepEqual(target, { a: 'a', b: 'b', c: { d: { e: 'e' } } })
//   origin.body = 'a'
//   origin.head = 'a'
//   // @ts-ignore
//   origin.toes.big = 'a'
//   // @ts-ignore
//   origin.fingers['12'] = 'a'
//   target.a = 'x'
//   target.b = 'x'
//   target.c.d.e = 'x'
//   t.deepEqual(origin, { body: 'a', head: 'a', toes: { big: 'a' }, fingers: { '12': 'a' } })
//   t.deepEqual(target, { a: 'x', b: 'x', c: { d: { e: 'x' } } })
//   t.deepEqual(res, {
//     body: '',
//     head: null,
//     toes: { big: true },
//     fingers: { '12': false },
//     a: 'a',
//     b: 'b',
//     c: { d: { e: 'e' } },
//   })
// })
// test('Clone Objects', t => {
//   const origin = { body: '', head: null, toes: { big: true }, fingers: { '12': false } }
//   const clone = merge({ extensions: [cloneFn] }, origin)
//   t.deepEqual(clone, { body: '', head: null, toes: { big: true }, fingers: { '12': false } })
//   t.deepEqual(origin, { body: '', head: null, toes: { big: true }, fingers: { '12': false } })
//   origin.body = 'a'
//   origin.head = 'a'
//   // @ts-ignore
//   origin.toes.big = 'a'
//   // @ts-ignore
//   origin.fingers['12'] = 'a'
//   t.deepEqual(clone, { body: '', head: null, toes: { big: true }, fingers: { '12': false } })
//   t.deepEqual(origin, { body: 'a', head: 'a', toes: { big: 'a' }, fingers: { '12': 'a' } })
// })
// test('Extend conversion', t => {
//   function convertTimestamps (originVal, targetVal) {
//     if (originVal === '%convertTimestamp%' && isString(targetVal) && isDate(new Date(targetVal))) {
//       return new Date(targetVal)
//     }
//     return targetVal
//   }
//   const origin = {
//     date: '%convertTimestamp%',
//   }
//   const target = {
//     date: '1990-06-22',
//   }
//   const res = merge({ extensions: [convertTimestamps] }, origin, target)
//   t.deepEqual(res, { date: new Date('1990-06-22') })
//   const res2 = merge({ extensions: [convertTimestamps] }, '%convertTimestamp%', '1990-06-22')
//   t.deepEqual(res2, new Date('1990-06-22'))
// })
// test('Extend with custom concat arrays', t => {
//   function concatArr (originVal, targetVal) {
//     if (isArray(originVal) && isArray(targetVal)) {
//       return originVal.concat(targetVal)
//     }
//     return targetVal
//   }
//   const origin = {
//     someArray: ['a'],
//     a: { b: { c: ['x'] } },
//   }
//   const target = {
//     someArray: ['b'],
//     a: { b: { c: ['y'] } },
//   }
//   const res = merge({ extensions: [concatArr] }, origin, target)
//   t.deepEqual(res, { someArray: ['a', 'b'], a: { b: { c: ['x', 'y'] } } })
//   // also works on base lvl
//   const res2 = merge({ extensions: [concatArr] }, ['a'], ['b'])
//   t.deepEqual(res2, ['a', 'b'])
// })
