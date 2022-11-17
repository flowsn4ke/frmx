export const getValidationMethod = (arrx: any, field: string, schemaValidation: object) => {
  let validationPath = Boolean(arrx)
    ? field.replace(new RegExp(`${arrx.validationPath}\.[0-9]+`, 'g'), arrx.validationPath)
    : field
  return schemaValidation[validationPath]
}
