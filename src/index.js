import { isObject, isArray } from 'is-what'

function mergeRecursively (origin, newComer, extensions) {
  // work directly on newComer if its not an object
  if (!isObject(newComer)) {
    // extend merge rules
    if (extensions && isArray(extensions)) {
      extensions.forEach(extend => {
        newComer = extend(origin, newComer)
      })
    }
    return newComer
  }
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
      // re-define the origin and newComer as targetVal and newVal
      let newVal = newComer[key]
      const targetVal = (isObject(origin))
        ? origin[key]
        : undefined
      // extend merge rules
      if (extensions && isArray(extensions)) {
        extensions.forEach(extend => {
          newVal = extend(targetVal, newVal)
        })
      }
      // early return when targetVal === undefined
      if (targetVal === undefined) {
        carry[key] = newVal
        return carry
      }
      // When newVal is an object do the merge recursively
      if (isObject(newVal)) {
        carry[key] = mergeRecursively(targetVal, newVal, extensions)
        return carry
      }
      // all the rest
      carry[key] = newVal
      return carry
    }, newObject)
}

/**
 * Merge anything
 *
 * @param {object} origin the default values, OR {extensions} to pass an array of functions with extentions
 * @param {object} newComer on which to set the default values
 */
export default function (origin, ...newComers) {
  let extensions = null
  let base = origin
  if (origin['extensions'] && Object.keys(origin).length === 1) {
    base = {}
    extensions = origin.extensions
  }
  return newComers.reduce((result, newComer) => {
    return mergeRecursively(result, newComer, extensions)
  }, base)
}
