import React, { cloneElement, Children, useEffect, useMemo, useState } from "react"
import { useFrmX } from "./FrmXContext"
import { useArrX } from "./ArrXContext"
import { getValidationMethod } from "./utils/getValidationMethod"
import { cloneDeep } from "lodash"

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
    setOneError,
    setOneVisited,
    isSubmitting,
    schemaValidation
  } = useFrmX()

  const [fieldVal, setFieldVal] = useState(cloneDeep(getOneField(field)))
  const [fieldVisited, setFieldVisited] = useState(false)

  const arrx = useArrX()

  const validationMethod = useMemo(() => getValidationMethod(arrx, field, schemaValidation), [getValidationMethod, schemaValidation])
  const isError = useMemo(() => !!validationMethod ? !validationMethod(fieldVal) : false, [fieldVal])

  useEffect(() => setOneError(field, isError), [setOneError, field, isError])

  const onChange = (e) => {
    const value = type === "checkbox" ? e.target.checked : e.target.value
    setFieldVal(value)
    setOneField(field, value)
  }

  const onBlur = () => {
    setFieldVisited(true)
    setOneVisited(field)
  }

  const props = useMemo(() => ({
    "aria-label": field,
    type,
    onBlur,
    onChange,
    required,
    disabled: isSubmitting,
    [type === "checkbox" ? "checked" : "value"]: fieldVal,
    ...(isErrorProp ? { [isErrorProp]: isError && fieldVisited ? true : false } : {}),
    ...(autoCorrectOff && { autoCorrect: "off" }),
    ...(autoCapitalizeOff && { autoCapitalize: "none" }),
    ...rest
  }), [fieldVal, fieldVisited, isError, field, type, onBlur, onChange, required, isSubmitting, autoCorrectOff, autoCapitalizeOff, rest])

  return useMemo(() => {
    return Children.only(children) && Children.map(children, child => cloneElement(child, props))
  }, [fieldVal, fieldVisited, isError, isSubmitting])
}
