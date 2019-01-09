# Merge anything 🥡

```
npm i merge-anything
```

Merge objects & other types recursively. A simple & small integration.

## Motivation

I created this package because I tried a lot of similar packages that do merging/deepmerging/recursive object assign etc. But all had its quirks, and *all of them break things they are not supposed to break*... 😞

I was looking for:

- a simple merge function like `Object.assign()`
- supports merging of nested properties
- **does not break special class instances**　‼️

This last one is crucial! In JavaScript almost everything is _an object_, sure, but I don't want a merge function trying to merge eg. two `new Date()` instances! So many libraries use custom classes that create objects with special prototypes, and they all break trying when trying to merge them. So we gotta be careful!

merge-anything will merge objects with nested properties but only "plain objects". As soon as a sub-prop is not a "plain object" and has a special prototype, it will copy that instance over "as is". ♻️

## Meet the anything family

- [merge-anything](https://github.com/mesqueeb/merge-anything)
- [filter-anything](https://github.com/mesqueeb/filter-anything)
- [find-and-replace-anything](https://github.com/mesqueeb/find-and-replace-anything)
- copy-anything (WIP)
- [is-what](https://github.com/mesqueeb/is-what)

## Usage

Pass the base param first and then an unlimited amount of params to merge onto it.

```js
import merge from 'merge-anything'

const starter = {name: 'Squirtle', type: 'water'}
const newValues = {name: 'Wartortle', level: 16}

merge(starter, newValues, {is: 'cool'})
// returns {
//   name: 'Wartortle',
//   type: 'water,
//   level: 16,
//   is: 'cool'
// }
```

## Rules

This package will recursively go through plain objects and merge the values onto a new object.

> Please note that this package recognises special JavaScript objects like classes. In such cases it will not recursively merge them like objects, but assign the class onto the new object "as is"!

```js
// all passed objects do not get modified
const a = {a: 'a'}
const b = {b: 'b'}
const c = merge(a, b)
// a === {a: 'a'}
// b === {b: 'b'}
// c === {a: 'a', b: 'b'}
// However, be careful with JavaScript object references. See below: A note on JavaScript object references

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

### Concat arrays

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

## A note on JavaScript object references

```js
const original = {lvl1: {lvl2: 'a'}}
const new = {}
const merged = merge(original, merged)
original.lvl1.lvl2 = 'b'
// This will change the value for `original` AND `merged`!!!
original.lvl1.lvl2 === 'b' // true
merged.lvl1.lvl2 === 'b' // true
```

One work around would be to add the custom merge rule:

```js
function cloneFn (originVal, targetVal) {
  if (isObject(targetVal)) return JSON.parse(JSON.stringify(targetVal))
  return targetVal
}
// and do
const merged = merge({extensions: [cloneFn]}, original, merged)
// However, this is slow when working with large sets of data!
```

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
