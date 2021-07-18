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
