import { get } from "lodash"

export const getValidationMethod = (arrx, field, schemaValidation) => {
  let validationPath

  if (!!arrx) {
    const relPath = field.slice(arrx.validationPath.length)
    const arrIndexLength = relPath.match(/^.\d+/)[0].length
    const start = arrx.validationPath
    const end = relPath.slice(arrIndexLength)
    validationPath = start + end
  } else {
    validationPath = field
  }

  return get(schemaValidation, validationPath)
}
