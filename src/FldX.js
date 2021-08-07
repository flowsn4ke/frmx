import React, { cloneElement, Children, Fragment, useEffect, useMemo } from "react"
import { useFrmX } from "./FrmXContext"
import { useArrX } from "./ArrXContext"
import { getValidationMethod } from "./utils/getValidationMethod"

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
    getOneField,
    setOneField,
    getOneVisited,
    getOneError,
    setOneError,
    setOneVisited,
    isSubmitting,
    schemaValidation
  } = useFrmX()

  const arrx = useArrX()

  const validationMethod = useMemo(() => getValidationMethod(arrx, field, schemaValidation), [getValidationMethod, schemaValidation])

  useEffect(() => {
    setOneError(field, validationMethod ? !validationMethod(getOneField(field)) : false)
    return () => setOneError(field, false)
  }, [])

  const onChange = e => {
    const value = type === "checkbox" ? e.target.checked : e.target.value
    setOneField(field, value)
    const isError = !!validationMethod ? !validationMethod(value) : false
    setOneError(field, isError)
  }
  const onBlur = e => setOneVisited(field)

  const props = {
    name: field,
    id: field,
    "aria-label": field,
    type,
    onBlur,
    onChange,
    required: required,
    disabled: isSubmitting,
    [type === "checkbox" ? "checked" : "value"]: getOneField(field),
    ...(isErrorProp ? { [isErrorProp]: getOneError(field) && getOneVisited(field) ? true : false } : {}),
    ...(autoCorrectOff && { autoCorrect: "off" }),
    ...(autoCapitalizeOff && { autoCapitalize: "none" }),
    ...rest
  }

  return <Fragment>
    {Children.only(children) && Children.map(children, child => cloneElement(child, props))}
  </Fragment>
};
