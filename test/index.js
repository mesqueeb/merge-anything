import test from 'ava'
import merge from '../dist/index.cjs'
import { isDate, isFunction } from 'is-what'

test('merge-anything', t => {
  let res, origin, target
  const nd = new Date()
  origin = {body: 'a'}
  target = {dueDate: nd}
  res = merge(origin, target)
  t.true(isDate(res.dueDate))
  t.is(res.body, 'a')
  t.deepEqual(origin, {body: 'a'})
  t.deepEqual(target, {dueDate: nd})

  origin = {
    body: '',
    head: null,
    toes: {big: true},
    fingers: {'12': false}
  }
  target = {body: {}, head: {}, toes: {}, fingers: null}
  res = merge(origin, target)
  t.deepEqual(res, {body: {}, head: {}, toes: {big: true}, fingers: null})

  origin = {body: 'a'}
  target = {body: 'b'}
  res = merge(origin, target)
  t.is(res.body, 'b')
  t.deepEqual(origin, {body: 'a'})
  t.deepEqual(target, {body: 'b'})

  const newDate = new Date()
  origin = {
    info: {
      time: 'now',
      newDate,
      very: {
        deep: {
          prop: false
        }
      }
    }
  }
  target = {
    info: {
      date: 'tomorrow',
      very: {
        deep: {
          prop: true
        }
      }
    }
  }
  res = merge(origin, target)
  t.deepEqual(res, {
    info: {
      time: 'now',
      newDate,
      date: 'tomorrow',
      very: {
        deep: {
          prop: true
        }
      }
    }
  })
  t.deepEqual(origin, {
    info: {
      time: 'now',
      newDate,
      very: {
        deep: {prop: false}
      }
    }
  })
  t.deepEqual(target, {
    info: {
      date: 'tomorrow',
      very: {
        deep: {prop: true}
      }
    }
  })
  t.true(isDate(res.info.newDate))

  origin = {
    info: {
      time: {when: 'now'},
      very: {
        deep: {prop: false}
      }
    }
  }
  target = {
    info: {
      time: {},
      very: {whole: 1}
    }
  }
  res = merge(origin, target)
  t.deepEqual(res, {
    info: {
      time: {when: 'now'},
      very: {
        deep: {prop: false},
        whole: 1
      }
    }
  })

  origin = {
    body: 'a',
    body2: {head: false},
    tail: {}
  }
  target = {
    body: {head: true},
    body2: {head: {eyes: true}},
  }
  res = merge(origin, target)
  t.deepEqual(res, {
    body: {head: true},
    body2: {head: {eyes: true}},
    tail: {}
  })
  t.deepEqual(origin, {
    body: 'a',
    body2: {head: false},
    tail: {}
  })
  t.deepEqual(target, {
    body: {head: true},
    body2: {head: {eyes: true}},
  })

  origin = {
    body: 'a',
    body2: {head: false},
    tail: {}
  }
  target = 'a'
  res = merge(origin, target)
  t.is(res, 'a')
  t.deepEqual(origin, {
    body: 'a',
    body2: {head: false},
    tail: {}
  })
})
