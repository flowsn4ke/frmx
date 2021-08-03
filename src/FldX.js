import React, { cloneElement, Children, Fragment, useEffect } from "react"
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
    getOneVisited,
    getOneError,
    setOneError,
    handleChange,
    setOneVisited,
    isSubmitting,
    schemaValidation
  } = useFrmX()

  const arrx = useArrX()

  useEffect(() => {
    const method = getValidationMethod(arrx, field, schemaValidation)
    setOneError(field, method ? !method(getOneField(field)) : false)
    return () => setOneError(field, false)
  }, [])

  const onChange = e => handleChange(e, arrx)
  const onBlur = e => setOneVisited(field)

  const props = {
    name: field,
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
