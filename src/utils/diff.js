import transform from "lodash-es/transform"
import isEqual from "lodash-es/isEqual"
import isArray from "lodash-es/isArray"
import isObject from "lodash-es/isObject"

export function deepDiff(prev, next) {
  function diff(next, prev) {
    let arr_i = 0
    return transform(next, function (res, val, key) {
      if (!isEqual(val, prev[key])) {
        let res_key = isArray(prev) ? arr_i++ : key
        res[res_key] = (isObject(val) && isObject(prev[key])) ? diff(val, prev[key]) : val
      }
    })
  }
  return diff(next, prev)
}

export function shallowDiff(prev, next) {
  const diff = deepDiff(prev, next)
  const result = {}

  Object.keys(diff).forEach(key => {
    result[key] = next[key]
  })

  return result
}

export function diffOnUpdatedKeys(prev, next) {
  const diff = deepDiff(prev, next)

  function withFullArrays(diff, next) {
    return transform(diff, (res, val, key) => {
      res[key] = isArray(val) && isArray(next[key]) ? next[key] : isObject(val) && isObject(next[key]) ? withFullArrays(diff[key], next[key]) : val
    })
  }

  return withFullArrays(diff, next)
}
