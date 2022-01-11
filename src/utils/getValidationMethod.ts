export const getValidationMethod = (arrx: { validationPath: string }, field: string, schemaValidation: object) => {
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

  return schemaValidation[validationPath]
}
