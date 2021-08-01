import React, { cloneElement, Children, Fragment, useMemo, useEffect, useCallback } from "react"
import { useFrmX } from "./FrmXContext"
import { get } from "lodash"
import { useArrX } from "./ArrXContext"

// TODO: Trim values when submitting based on prop && if type is text
export default function FldX({
  field,
  type = "text",
  valueProp = "value",
  onChangeProp = "onChange",
  isErrorProp,
  autoCorrectOff = false,
  autoCapitalizeOff = false,
  required,
  children,
  ...rest
}) {
  const {
    fields,
    visited,
    handleChange,
    handleBlur,
    handleError,
    isSubmitting,
    schemaValidation
  } = useFrmX()

  const arrx = useArrX()

  const visitedOnce = useMemo(() => {
    return get(visited, field)
  }, [get(visited, field)])

  const getValidationMethod = useCallback(() => {
    const isInsideArray = !!arrx
    let validationPath

    if (isInsideArray) {
      const relPath = field.slice(arrx.validationPath.length)
      const arrIndexLength = relPath.match(/^.\d+/)[0].length
      const start = arrx.validationPath
      const end = relPath.slice(arrIndexLength)
      validationPath = start + end
    } else {
      validationPath = field
    }

    return get(schemaValidation, validationPath)
  }, [schemaValidation])

  useEffect(() => {
    const method = getValidationMethod()
    return handleError(field, method ? !method(get(fields, field)) : false)
  }, [])

  const isError = useMemo(() => {
    const method = getValidationMethod()
    return method ? !method(get(fields, field)) : false
  }, [get(fields, field), get(visited, field)])

  const onChange = e => {
    handleChange(e)
    handleError(field, isError)
  }
  const onBlur = e => {
    handleBlur(e)
    handleChange(e)
    handleError(field, isError)
  }

  const props = {
    name: field,
    "aria-label": field,
    type,
    onBlur,
    onChange,
    required: required,
    disabled: isSubmitting,
    [type === "checkbox" ? "checked" : "value"]: get(fields, field),
    ...(isErrorProp ? { [isErrorProp]: isError && visitedOnce ? true : false } : {}),
    ...(autoCorrectOff && { autoCorrect: "off" }),
    ...(autoCapitalizeOff && { autoCapitalize: "none" }),
    ...rest
  }

  return <Fragment>
    {Children.only(children) && Children.map(children, child => cloneElement(child, props))}
  </Fragment>
};
