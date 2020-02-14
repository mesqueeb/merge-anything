# Merge anything 🥡

```
npm i merge-anything
```

Merge objects & other types recursively. Fully **TypeScript** supported! A simple & small integration.

## Motivation

I created this package because I tried a lot of similar packages that do merging/deepmerging/recursive object assign etc. But all had its quirks, and _all of them break things they are not supposed to break_... 😞

I was looking for:

- a simple merge function like `Object.assign()` but deep
- supports merging of nested properties
- supports TypeScript: the type of the result is what JS actually returns
- supports symbols
- supports enumerable & nonenumerable props
- **does not break special class instances**　‼️

This last one is crucial! In JavaScript almost everything is _an object_, sure, but I don't want a merge function trying to merge eg. two `new Date()` instances! So many libraries use custom classes that create objects with special prototypes, and such objects all break when trying to merge them. So we gotta be careful!

merge-anything will merge objects and nested properties, but only as long as they're "plain objects". As soon as a sub-prop is not a "plain object" and has a special prototype, it will copy that instance over "as is". ♻️

## Meet the family

- [merge-anything 🥡](https://github.com/mesqueeb/merge-anything)
- [filter-anything ⚔️](https://github.com/mesqueeb/filter-anything)
- [find-and-replace-anything 🎣](https://github.com/mesqueeb/find-and-replace-anything)
- [compare-anything 🛰](https://github.com/mesqueeb/compare-anything)
- [copy-anything 🎭](https://github.com/mesqueeb/copy-anything)
- [flatten-anything 🏏](https://github.com/mesqueeb/flatten-anything)
- [is-what 🙉](https://github.com/mesqueeb/is-what)

## Usage

Pass the base param first and then an unlimited amount of params to merge onto it.

```js
import { merge } from 'merge-anything'

const starter = { name: 'Squirtle', types: { water: true } }
const newValues = { name: 'Wartortle', types: { fighting: true }, level: 16 }

const evolution = merge(starter, newValues, { is: 'cool' })
// returns {
//   name: 'Wartortle',
//   types: { water: true, fighting: true },
//   level: 16,
//   is: 'cool'
// }
```

## TypeScript Support

In the example above, if you are using TypeScript, and you hover over `evolution`, you can actually see the type of your new object right then and there. This is very powerful, because you can merge things, and without needing `any`, TypeScript will know exactly how your newly merged objects look!

![typescript support](https://raw.githubusercontent.com/mesqueeb/merge-anything/master/.github/typescript-support.png)

## Rules

This package will recursively go through plain objects and merge the values onto a new object.

> Please note that this package recognises special JavaScript objects like class instances. In such cases it will not recursively merge them like objects, but assign the class onto the new object "as is"!

```js
// all passed objects do not get modified
const a = { a: 'a' }
const b = { b: 'b' }
const c = merge(a, b)
// a === {a: 'a'}
// b === {b: 'b'}
// c === {a: 'a', b: 'b'}
// However, be careful with JavaScript object references. See below: A note on JavaScript object references

// arrays get overwritten
// (for "concat" logic, see Extensions below)
merge({ array: ['a'] }, { array: ['b'] }) // returns {array: ['b']}

// empty objects merge into objects
merge({ obj: { prop: 'a' } }, { obj: {} }) // returns {obj: {prop: 'a'}}

// but non-objects overwrite objects
merge({ obj: { prop: 'a' } }, { obj: null }) // returns {obj: null}
merge({ obj: 'a' }, 'b') // returns 'b'

// and empty objects overwrite non-objects
merge({ prop: 'a' }, { prop: {} }) // returns {prop: {}}
```

merge-anything properly keeps special objects intact like dates, regex, functions, class instances etc.

However, it's **very important** you understand how to work around JavaScript object references. Please be sure to read [a note on JavaScript object references](#a-note-on-javascript-object-references) down below.

## Concat arrays

The default behaviour is that arrays are overwritten. You can import `mergeAndConcat` if you need to concatenate arrays. But don't worry if you don't need this, this library is tree-shakable and won't import code you don't use!

```js
import { mergeAndConcat } from 'merge-anything'

merge(
  { extensions: [concatArrays] }, // pass your extensions like so
  { nested: { prop: { array: ['a'] } } },
  { nested: { prop: { array: ['b'] } } }
)
// returns { nested: { prop: { array: ['a', 'b'] } } },
```

## Compare Function when a value is merged

There might be times you need to tweak the logic when two things are merged. You can provide your own custom function that's triggered every time a value is overwritten.

Here is an example with a compare function that concatenates strings:

```js
function concatStrings (originVal, newVal, key) {
  if (typeof originVal === 'string' && typeof newVal === 'string') {
    // concat logic
    return `${originVal}${newVal}`
  }
  // always return newVal as fallback!!
  return newVal
}

mergeAndCompare(concatStrings, { name: 'John' }, { name: 'Simth' })
// returns { name: 'JohnSmith' }
```

> Note for TypeScript users. The type returned by this function might not be correct. In that case you have to cast the result to your own provided interface

## A note on JavaScript object references

Be careful for JavaScript object reference. Any property that's nested will be reactive and linked between the original and the merged objects! Down below we'll show how to prevent this.

```js
const original = { airport: { airplane: 'dep. 🛫' } }
const extraInfo = { airport: { location: 'Brussels' } }
const merged = merge(original, extraInfo)

// we change the airplane from departuring 🛫 to landing 🛬
merged.airport.airplane = 'lan. 🛬'

// the `merged` value will be modified
// merged.airport.airplane === 'lan. 🛬'

// However `original` value will also be modified!!
// original.airport.airplane === 'lan. 🛬'
```

The key rule to remember is:

> Any property that's nested more than 1 level without an overlapping parent property will be reactive and linked in both the merge result and the source

However, **there is a really easy solution**. We can just copy the merge result to get rid of any reactivity. For this we can use the [copy-anything](https://github.com/mesqueeb/copy-anything) library. This library also makes sure that _special class instances do not break_, so you can use it without fear of breaking stuff!

See below how we integrate 'copy-anything':

```js
import copy from 'copy-anything'

const original = { airport: { airplane: 'dep. 🛫' } }
const extraInfo = { airport: { location: 'Brussels' } }
const merged = copy(merge(original, extraInfo))

// we change the airplane from departuring 🛫 to landing 🛬
merged.airport.airplane = 'lan. 🛬'(merged.airport.airplane === 'lan. 🛬')(
  // true
  // `original` won't be modified!
  original.airport.airplane === 'dep. 🛫'
) // true
```

You can then play around where you want to place the `copy()` function.

Copy Anything is also fully TypeScript supported!

## Source code

It is literally just going through an object recursively and assigning the values to a new object like below. However, it's wrapped to allow extra params etc. The code below is the basic integration, that will make you understand the basics how it works.

```js
import { isPlainObject } from 'is-what'

function mergeRecursively (origin, newComer) {
  if (!isPlainObject(newComer)) return newComer
  // define newObject to merge all values upon
  const newObject = isPlainObject(origin)
    ? Object.keys(origin).reduce((carry, key) => {
        const targetVal = origin[key]
        if (!Object.keys(newComer).includes(key)) carry[key] = targetVal
        return carry
      }, {})
    : {}
  return Object.keys(newComer).reduce((carry, key) => {
    const newVal = newComer[key]
    const targetVal = origin[key]
    // early return when targetVal === undefined
    if (targetVal === undefined) {
      carry[key] = newVal
      return carry
    }
    // When newVal is an object do the merge recursively
    if (isPlainObject(newVal)) {
      carry[key] = mergeRecursively(targetVal, newVal)
      return carry
    }
    // all the rest
    carry[key] = newVal
    return carry
  }, newObject)
}
```

\* Of course, there are small differences with the actual source code to cope with rare cases & extra features. The actual source code is [here](https://github.com/mesqueeb/merge-anything/blob/master/src/merge.ts).
