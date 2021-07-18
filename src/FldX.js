import React, { cloneElement, Children, Fragment } from "react"
import { useFrmX } from "./FrmXContext"
import _ from "lodash"

// TODO: Trim values when submitting based on prop && if type is text
export default function FldX({
  field,
  type = "text",
  validate,
  isErrorProp = "error",
  onChangeProp = "onChange",
  valueProp = "value",
  autoCorrectOff = false,
  autoCapitalizeOff = false,
  children,
  ...rest
}) {
  const { fields, errors, visited, handleChange, handleBlur, handleError } = useFrmX()

  const isError = (value) => validate && !validate(value) || false

  const onChange = (e) => {
    handleChange(e)

    if (_.get(visited, field)) {
      handleError(field, isError(e.target.value))
    }
  }

  const onBlur = (e) => {
    handleBlur(e)
    handleError(field, isError(e.target.value))
  }

  const props = {
    name: field,
    "aria-label": field,
    type,
    onBlur,
    onChange,
    [type === "checkbox" ? "checked" : "value"]: _.get(fields, field),
    ...(validate ? { [isErrorProp]: _.get(errors, field) } : {}),
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
