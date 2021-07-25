import _ from "lodash"

export const makeRecursiveKeyList = (obj, stack = '', validationMethods = []) => {

  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] == "object" && !(obj[property] instanceof Array)) {
        makeRecursiveKeyList(obj[property], stack + '.' + property, validationMethods);
      } else {
        validationMethods.push((stack + '.' + property).substring(1));
      }
    }
  }
  return validationMethods
}

export const isParentObject = (obj, path) => {
  const lastDot = path.lastIndexOf('.')
  const parentPath = path.slice(0, lastDot > 0 ? lastDot : path.length)
  const parent = _.get(obj, parentPath)
  const parentType = typeof parent
  return parent instanceof Object && parentType === "object" && !(parent instanceof Array)
}
