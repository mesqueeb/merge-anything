import test from 'ava'
import { isDate } from 'is-what'
import { merge } from '../src/index'

function copy<T> (any: T): T {
  return JSON.parse(JSON.stringify(any))
}

test('1. origin & target stays the same | 2. works with dates', t => {
  const nd = new Date()
  const origin = { body: 'a' }
  const target = { dueDate: nd }
  const res = merge(origin, target)
  t.deepEqual(res, { body: 'a', dueDate: nd })
  t.deepEqual(origin, { body: 'a' })
  t.deepEqual(target, { dueDate: nd })
})
test('adding a prop on target1|target2|mergedObj', t => {
  const origin = { nested: {} }
  const target = { nested: {} }
  const res = merge(origin, target)
  t.deepEqual(res, { nested: {} })
  const originAsAny: any = origin
  const targetAsAny: any = target
  const resAsAny: any = res
  originAsAny.nested.a = ''
  targetAsAny.nested.b = ''
  resAsAny.nested.c = ''
  t.deepEqual(originAsAny, { nested: { a: '' } })
  t.deepEqual(targetAsAny, { nested: { b: '' } })
  t.deepEqual(res, { nested: { c: '' } })
})
test('changing a prop on target1|target2|mergedObj: failing example', t => {
  const origin = { nested: { a: 1 } }
  const target = {}
  const res = merge(origin, target)
  t.deepEqual(res, { nested: { a: 1 } })
  origin.nested.a = 2
  t.deepEqual(origin, { nested: { a: 2 } }) // linked
  t.deepEqual(target, {})
  t.deepEqual(res, { nested: { a: 2 } }) // linked
  const targetAsAny: any = target
  targetAsAny.nested = { a: 3 }
  t.deepEqual(origin, { nested: { a: 2 } }) // not changed
  t.deepEqual(targetAsAny, { nested: { a: 3 } })
  t.deepEqual(res, { nested: { a: 2 } }) // not changed
  res.nested.a = 4
  t.deepEqual(origin, { nested: { a: 4 } }) // linked
  t.deepEqual(targetAsAny, { nested: { a: 3 } })
  t.deepEqual(res, { nested: { a: 4 } }) // linked
})
test('changing a prop on target1|target2|mergedObj: working example', t => {
  const origin = { nested: { a: 1 } }
  const target = {}
  const merged = merge(origin, target)
  const res = copy(merged)
  t.deepEqual(res, { nested: { a: 1 } })
  origin.nested.a = 2
  t.deepEqual(origin, { nested: { a: 2 } }) // not linked
  t.deepEqual(target, {})
  t.deepEqual(res, { nested: { a: 1 } }) // not linked
  const targetAsAny: any = target
  targetAsAny.nested = { a: 3 }
  t.deepEqual(origin, { nested: { a: 2 } }) // not changed
  t.deepEqual(targetAsAny, { nested: { a: 3 } })
  t.deepEqual(res, { nested: { a: 1 } }) // not changed
  res.nested.a = 4
  t.deepEqual(origin, { nested: { a: 2 } }) // not linked
  t.deepEqual(targetAsAny, { nested: { a: 3 } })
  t.deepEqual(res, { nested: { a: 4 } }) // not linked
})
test('1. works with multiple levels | 2. overwrites entire object with null', t => {
  const origin = { body: '', head: null, toes: { big: true }, fingers: { '12': false } }
  const target = { body: {}, head: {}, toes: {}, fingers: null }
  const res = merge(origin, target)
  t.deepEqual(res, { body: {}, head: {}, toes: { big: true }, fingers: null })
})
test('origin and target are not AsAny', t => {
  const origin = { body: '', head: null, toes: { big: true }, fingers: { '12': false } }
  const target = { body: {}, head: {}, toes: {}, fingers: null }
  const res = merge(origin, target)
  t.deepEqual(res, { body: {}, head: {}, toes: { big: true }, fingers: null })
  t.deepEqual(origin, { body: '', head: null, toes: { big: true }, fingers: { '12': false } })
  t.deepEqual(target, { body: {}, head: {}, toes: {}, fingers: null })
  origin.body = 'a'
  const originAsAny: any = origin
  const targetAsAny: any = target
  originAsAny.head = 'a'
  originAsAny.toes.big = 'a'
  originAsAny.fingers['12'] = 'a'
  targetAsAny.body = 'b'
  targetAsAny.head = 'b'
  targetAsAny.toes = 'b'
  targetAsAny.fingers = 'b'
  t.deepEqual(res, { body: {}, head: {}, toes: { big: true }, fingers: null })
  t.deepEqual(originAsAny, { body: 'a', head: 'a', toes: { big: 'a' }, fingers: { '12': 'a' } })
  t.deepEqual(targetAsAny, { body: 'b', head: 'b', toes: 'b', fingers: 'b' })
})
test('Overwrite arrays', t => {
  const origin = { array: ['a'] }
  const target = { array: ['b'] }
  const res = merge(origin, target)
  t.deepEqual(res, { array: ['b'] })
})
test('overwrites null with empty object', t => {
  const origin = { body: null }
  const target = { body: {} }
  const res = merge(origin, target)
  t.deepEqual(res, { body: {} })
})
test('overwrites null with object with props', t => {
  const origin = { body: null }
  const target = { body: { props: true } }
  const res = merge(origin, target)
  t.deepEqual(res, { body: { props: true } })
})
test('overwrites string values', t => {
  const origin = { body: 'a' }
  const target = { body: 'b' }
  const res = merge(origin, target)
  t.deepEqual(res, { body: 'b' })
  t.deepEqual(origin, { body: 'a' })
  t.deepEqual(target, { body: 'b' })
})
test('works with very deep props & dates', t => {
  const newDate = new Date()
  const origin = {
    info: {
      time: 'now',
      newDate,
      very: { deep: { prop: false } },
    },
  }
  const target = {
    info: {
      date: 'tomorrow',
      very: { deep: { prop: true } },
    },
  }
  const res = merge(origin, target)
  t.deepEqual(res, {
    info: {
      time: 'now',
      newDate,
      date: 'tomorrow',
      very: { deep: { prop: true } },
    },
  })
  t.deepEqual(origin, {
    info: {
      time: 'now',
      newDate,
      very: { deep: { prop: false } },
    },
  })
  t.deepEqual(target, {
    info: {
      date: 'tomorrow',
      very: { deep: { prop: true } },
    },
  })
  t.true(isDate(res.info.newDate))
})
test('1. does not overwrite origin prop if target prop is an empty object | 2. properly merges deep props', t => {
  const origin = {
    info: {
      time: { when: 'now' },
      very: { deep: { prop: false } },
    },
  }
  const target = {
    info: {
      time: {},
      very: { whole: 1 },
    },
  }
  const res = merge(origin, target)
  t.deepEqual(res, {
    info: {
      time: { when: 'now' },
      very: {
        deep: { prop: false },
        whole: 1,
      },
    },
  })
})
test('overwrites any origin prop when target prop is an object with props', t => {
  const origin = {
    body: 'a',
    body2: { head: false },
    tail: {},
  }
  const target = {
    body: { head: true },
    body2: { head: { eyes: true } },
  }
  const res = merge(origin, target)
  t.deepEqual(res, {
    body: { head: true },
    body2: { head: { eyes: true } },
    tail: {},
  })
  t.deepEqual(origin, {
    body: 'a',
    body2: { head: false },
    tail: {},
  })
  t.deepEqual(target, {
    body: { head: true },
    body2: { head: { eyes: true } },
  })
})

test('works with unlimited depth', t => {
  const date = new Date()
  const origin = { origin: 'a', t2: false, t3: {}, t4: 'false' }
  const t1 = { t1: date }
  const t2 = { t2: 'new' }
  const t3 = { t3: 'new' }
  const t4 = { t4: 'new', t3: {} }
  const res = merge(origin, t1, t2, t3, t4)
  t.deepEqual(res, { origin: 'a', t1: date, t2: 'new', t3: {}, t4: 'new' })
  t.deepEqual(origin, { origin: 'a', t2: false, t3: {}, t4: 'false' })
  t.deepEqual(t1, { t1: date })
  t.deepEqual(t2, { t2: 'new' })
  t.deepEqual(t3, { t3: 'new' })
  t.deepEqual(t4, { t4: 'new', t3: {} })
})

test('symbols as keys 1', t => {
  const mySymbol = Symbol('mySymbol')
  const x = { value: 42, [mySymbol]: 'hello' }
  const y = { other: 33 }
  const res = merge(x, y)
  t.is(res.value, 42)
  t.is(res.other, 33)
  t.is(res[mySymbol], 'hello')
})
test('symbols as keys 2', t => {
  const mySymbol = Symbol('mySymbol')
  const x = { value: 42 }
  const y = { other: 33, [mySymbol]: 'hello' }
  const res = merge(x, y)
  t.is(res.value, 42)
  t.is(res.other, 33)
  t.is(res[mySymbol], 'hello')
})

test('nonenumerable keys', t => {
  const mySymbol = Symbol('mySymbol')
  const x = { value: 42 }
  const y = { other: 33 }
  Object.defineProperty(x, 'xid', {
    value: 1,
    writable: true,
    enumerable: false,
    configurable: true,
  })
  Object.defineProperty(x, mySymbol, {
    value: 'original',
    writable: true,
    enumerable: false,
    configurable: true,
  })
  Object.defineProperty(y, 'yid', {
    value: 2,
    writable: true,
    enumerable: false,
    configurable: true,
  })
  Object.defineProperty(y, mySymbol, {
    value: 'new',
    writable: true,
    enumerable: false,
    configurable: true,
  })
  const res = merge(x, y)
  t.is(res.value, 42)
  t.is(res.other, 33)
  t.is((res as any).xid, 1)
  t.is((res as any).yid, 2)
  t.is((res as any)[mySymbol], 'new')
  t.is(Object.keys(res).length, 2)
  t.true(Object.keys(res).includes('value'))
  t.true(Object.keys(res).includes('other'))
})

test('readme', t => {
  const starter = { name: 'Squirtle', types: { water: true } }
  const newValues = { name: 'Wartortle', types: { fighting: true }, level: 16 }
  const evolution = merge(starter, newValues, { is: 'cool' })
  t.deepEqual(evolution, {
    name: 'Wartortle',
    types: { water: true, fighting: true },
    level: 16,
    is: 'cool',
  })
})
