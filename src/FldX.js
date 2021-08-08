import { cloneElement, Children, useEffect, useMemo, useState } from "react"
import { useFrmX } from "./FrmXContext"
import { useArrX } from "./ArrXContext"
import { getValidationMethod } from "./utils/getValidationMethod"

// TODO: Trim values when submitting based on prop && if type is text
export default function FldX({
  field,
  getValueFromArgs,
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
    setOneError,
    getOneVisited,
    setOneVisited,
    isSubmitting,
    schemaValidation
  } = useFrmX()

  const value = useMemo(() => getOneField(field), [getOneField, field])
  const visited = useMemo(() => getOneVisited(field), [getOneVisited, field])

  const arrx = useArrX()

  const validationMethod = useMemo(() => getValidationMethod(arrx, field, schemaValidation), [getValidationMethod, schemaValidation])
  const isError = useMemo(() => !!validationMethod ? !validationMethod(value) : false, [value])

  useEffect(() => setOneError(field, isError), [setOneError, field, isError])

  const onChange = (...args) => {
    const val = !!getValueFromArgs ? getValueFromArgs(args) : type === "checkbox" ? args[0].target.checked : args[0].target.value
    setOneField(field, val)
  }

  const onBlur = () => {
    setOneVisited(field)
  }

  const props = useMemo(() => ({
    type,
    onBlur,
    onChange,
    required,
    disabled: isSubmitting,
    [type === "checkbox" ? "checked" : "value"]: value,
    ...(isErrorProp ? { [isErrorProp]: isError && visited ? true : false } : {}),
    ...(autoCorrectOff && { autoCorrect: "off" }),
    ...(autoCapitalizeOff && { autoCapitalize: "none" }),
    ...rest
  }), [value, visited, isError, field, type, onBlur, onChange, required, isSubmitting, autoCorrectOff, autoCapitalizeOff, rest])

  return useMemo(() => {
    return Children.only(children) && Children.map(children, child => cloneElement(child, props))
  }, [value, visited, isError, isSubmitting])
}
