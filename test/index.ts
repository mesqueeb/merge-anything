import test from 'ava'
import { isDate } from 'is-what'
import { merge } from '../src/index'
// import copy from 'copy-anything'
// const copy = require('copy')
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
  // @ts-ignore
  origin.nested.a = ''
  // @ts-ignore
  target.nested.b = ''
  // @ts-ignore
  res.nested.c = ''
  t.deepEqual(origin, { nested: { a: '' } })
  t.deepEqual(target, { nested: { b: '' } })
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
  // @ts-ignore
  target.nested = { a: 3 }
  t.deepEqual(origin, { nested: { a: 2 } }) // not changed
  t.deepEqual(target, { nested: { a: 3 } })
  t.deepEqual(res, { nested: { a: 2 } }) // not changed
  res.nested.a = 4
  t.deepEqual(origin, { nested: { a: 4 } }) // linked
  t.deepEqual(target, { nested: { a: 3 } })
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
  // @ts-ignore
  target.nested = { a: 3 }
  t.deepEqual(origin, { nested: { a: 2 } }) // not changed
  t.deepEqual(target, { nested: { a: 3 } })
  t.deepEqual(res, { nested: { a: 1 } }) // not changed
  res.nested.a = 4
  t.deepEqual(origin, { nested: { a: 2 } }) // not linked
  t.deepEqual(target, { nested: { a: 3 } })
  t.deepEqual(res, { nested: { a: 4 } }) // not linked
})
test('1. works with multiple levels | 2. overwrites entire object with null', t => {
  const origin = { body: '', head: null, toes: { big: true }, fingers: { '12': false } }
  const target = { body: {}, head: {}, toes: {}, fingers: null }
  const res = merge(origin, target)
  t.deepEqual(res, { body: {}, head: {}, toes: { big: true }, fingers: null })
})
test('origin and target are not modified', t => {
  const origin = { body: '', head: null, toes: { big: true }, fingers: { '12': false } }
  const target = { body: {}, head: {}, toes: {}, fingers: null }
  const res = merge(origin, target)
  t.deepEqual(res, { body: {}, head: {}, toes: { big: true }, fingers: null })
  t.deepEqual(origin, { body: '', head: null, toes: { big: true }, fingers: { '12': false } })
  t.deepEqual(target, { body: {}, head: {}, toes: {}, fingers: null })
  origin.body = 'a'
  origin.head = 'a'
  // @ts-ignore
  origin.toes.big = 'a'
  // @ts-ignore
  origin.fingers['12'] = 'a'
  target.body = 'b'
  target.head = 'b'
  target.toes = 'b'
  target.fingers = 'b'
  t.deepEqual(res, { body: {}, head: {}, toes: { big: true }, fingers: null })
  // @ts-ignore
  t.deepEqual(origin, { body: 'a', head: 'a', toes: { big: 'a' }, fingers: { '12': 'a' } })
  // @ts-ignore
  t.deepEqual(target, { body: 'b', head: 'b', toes: 'b', fingers: 'b' })
})

test('Overwrite arrays', t => {
  const origin = { array: ['a'] }
  const target = { array: ['b'] }
  const res = merge(origin, target)
  t.deepEqual(res, { array: ['b'] })
})
test('overwrites null with empty object', t => {
  const origin = {
    body: null,
  }
  const target = {
    body: {},
  }
  const res = merge(origin, target)
  t.deepEqual(res, { body: {} })
})
test('overwrites null with object with props', t => {
  const origin = {
    body: null,
  }
  const target = {
    body: { props: true },
  }
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
      very: {
        deep: {
          prop: false,
        },
      },
    },
  }
  const target = {
    info: {
      date: 'tomorrow',
      very: {
        deep: {
          prop: true,
        },
      },
    },
  }
  const res = merge(origin, target)
  t.deepEqual(res, {
    info: {
      // @ts-ignore
      time: 'now',
      newDate,
      date: 'tomorrow',
      very: {
        deep: {
          prop: true,
        },
      },
    },
  })
  t.deepEqual(origin, {
    info: {
      time: 'now',
      newDate,
      very: {
        deep: { prop: false },
      },
    },
  })
  t.deepEqual(target, {
    info: {
      date: 'tomorrow',
      very: {
        deep: { prop: true },
      },
    },
  })
  // @ts-ignore
  t.true(isDate(res.info.newDate))
})
test('1. does not overwrite origin prop if target prop is an empty object | 2. properly merges deep props', t => {
  const origin = {
    info: {
      time: { when: 'now' },
      very: {
        deep: { prop: false },
      },
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
        // @ts-ignore
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
test('overwrites entire objects when target val is a simple string', t => {
  const origin = {
    body: 'a',
    body2: { head: false },
    tail: {},
  }
  const target = 'a'
  const res = merge(origin, target)
  // @ts-ignore
  t.is(res, 'a')
  t.deepEqual(origin, {
    body: 'a',
    body2: { head: false },
    tail: {},
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
  // @ts-ignore
  t.is(res.xid, 1)
  // @ts-ignore
  t.is(res.yid, 2)
  t.is(res[mySymbol], 'new')
  t.is(Object.keys(res).length, 2)
  t.true(Object.keys(res).includes('value'))
  t.true(Object.keys(res).includes('other'))
})
