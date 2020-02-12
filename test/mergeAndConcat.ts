import test from 'ava'
// import { merge, concatArrays } from '../src/index'

test('.', t => t.pass())

// test('import concat array extension', t => {
//   const origin = {
//     someArray: ['a'],
//     a: { b: { c: ['x'] } },
//   }
//   const target = {
//     someArray: ['b'],
//     a: { b: { c: ['y'] } },
//   }
//   const res = merge({ extensions: [concatArrays] }, origin, target)
//   t.deepEqual(res, { someArray: ['a', 'b'], a: { b: { c: ['x', 'y'] } } })
//   // also works on base lvl
//   const res2 = merge({ extensions: [concatArrays] }, ['a'], ['b'])
//   t.deepEqual(res2, ['a', 'b'])
// })
