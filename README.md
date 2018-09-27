# Merge anything 🥡

```
npm i merge-anything
```

Merge objects & other types recursively. A simple & small integration.

## Motivation

I created this package because I tried a lot of similar packages that do merging/deepmerging/recursive object assign etc. But all had its quirks, and **none were the simple implementation I was looking for**.

## Usage

Pass the base param first and then an unlimited amount of params to merge onto it.

```js
import merge from 'merge-anything'

const starter = {name: 'Squirtle', type: 'water'}
const newValues = {name: 'Warturtle', level: 16}

merge(starter, newValues, {is: 'cool'})
// returns {
//   name: 'Warturtle',
//   type: 'water,
//   level: 16,
//   is: 'cool'
// }
```

## Rules

```js
// all passed objects STAY AS IS and do not get modified
const a = {a: 'a'}
const b = {b: 'b'}
const c = merge(a, b)
// a === {a: 'a'}
// b === {b: 'b'}
// c === {a: 'a', b: 'b'}

// arrays get overwritten
merge({array: ['a']}, {array: ['b']}) // returns {array: ['b']}

// empty objects merge into objects
merge({obj: {prop: 'a'}}, {obj: {}}) // returns {obj: {prop: 'a'}}

// but non-objects overwrite objects
merge({obj: {prop: 'a'}}, {obj: null}) // returns {prop: null}
merge({obj: 'a'}, 'b') // returns 'b'

// and empty objects overwrite non-objects
merge({prop: 'a'}, {prop: {}}) // returns {prop: {}}
```

It also properly keeps others special objects in-tact like dates, regex, functions etc.

## Extend merge rules

merge-anything can be really powerful because every step of the way **you can define rules to extend the overwrite logic.**

Eg. merge-anything will overwrite arrays by default but you could change this logic to make it so it will concat the arrays.

To do so your first parameter you pass has to be an object that looks like `{extensions: []}` and include an array of functions. In these functions you can change the value that will be overwriting the origin. See how to do this below:

```js
function concatArrays (originVal, newVal) {
  if (Array.isArray(originVal) && Array.isArray(newVal)) {
    // concat logic
    return originVal.concat(newVal)
  }
  return newVal // always return newVal as fallback!!
}
merge(
  {extensions: [concatArrays]}, // pass your extensions like so
  {array: ['a']},
  {array: ['b']}
)
// results in {array: ['a', 'b']}
```

Please note that each extension-function receives an `originVal` and `newVal` and **has** to return the `newVal` on fallback no matter what (in case your condition check fails or something)!

## Source code

It is literally just going through an object recursively and assigning the values to a new object like below. However, it's wrapped to allow extra params etc. The code below is the basic integration, that will make you understand the basics how it works.

```js
function mergeRecursively (origin, newComer) {
  if (!isObject(newComer)) return newComer
  // define newObject to merge all values upon
  const newObject = (isObject(origin))
    ? Object.keys(origin)
      .reduce((carry, key) => {
        const targetVal = origin[key]
        if (!Object.keys(newComer).includes(key)) carry[key] = targetVal
        return carry
      }, {})
    : {}
  return Object.keys(newComer)
    .reduce((carry, key) => {
      const newVal = newComer[key]
      const targetVal = origin[key]
      // early return when targetVal === undefined
      if (targetVal === undefined) {
        carry[key] = newVal
        return carry
      }
      // When newVal is an object do the merge recursively
      if (isObject(newVal)) {
        carry[key] = mergeRecursively(targetVal, newVal)
        return carry
      }
      // all the rest
      carry[key] = newVal
      return carry
    }, newObject)
}
```

\* Of course, there are small differences with the actual source code to cope with rare cases & extra features. The actual source code is [here](https://github.com/mesqueeb/merge-anything/blob/master/src/index.js).
