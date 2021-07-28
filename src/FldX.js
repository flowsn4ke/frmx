import React, { cloneElement, Children, Fragment } from "react"
import { useFrmX } from "./FrmXContext"
import { get } from "lodash"

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
  // TODO: Add a set required so that form is disabled when a field is required?
  const {
    fields,
    errors,
    visited,
    handleChange,
    handleBlur,
    handleError,
    isSubmitting,
    schemaValidation
  } = useFrmX()

  const isError = () => {
    const isValid = get(schemaValidation, field)
    if (isValid) return !isValid(get(fields, field))
    else return false
  }

  const onChange = (e) => {
    handleChange(e)

    if (get(visited, field)) {
      handleError(field, isError())
    }
  }

  const onBlur = (e) => {
    handleBlur(e)
    handleError(field, isError())
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
    ...(isErrorProp ? { [isErrorProp]: get(errors, field) } : {}),
    ...(autoCorrectOff && { autoCorrect: "off" }),
    ...(autoCapitalizeOff && { autoCapitalize: "none" }),
    ...rest
  }

  return <Fragment>
    {Children.only(children) && Children.map(children, child => {
      return cloneElement(child, props)
    })}
  </Fragment>
};
