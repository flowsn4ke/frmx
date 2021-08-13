import transform from "lodash-es/transform"
import isEqual from "lodash-es/isEqual"
import isArray from "lodash-es/isArray"
import isObject from "lodash-es/isObject"

export function deepDiff(prev, next) {
  function changes(next, prev) {
    let arr_i = 0
    return transform(next, function (res, val, key) {
      if (!isEqual(val, prev[key])) {
        let res_key = isArray(prev) ? arr_i++ : key
        res[res_key] = (isObject(val) && isObject(prev[key])) ? changes(val, prev[key]) : val
      }
    })
  }
  return changes(next, prev)
}
