import { cloneElement, Children, useEffect, useMemo } from 'react'

import { useFrmX, useArrX } from './Contexts'
import { getValidationMethod } from './utils/getValidationMethod'

// TODO: Trim values when submitting based on prop && if type is text
export default function FldX({
  afterChange,
  autoCorrectOff = false,
  autoCapitalizeOff = false,
  children,
  disabled: manuallyDisabled,
  field,
  getValueFromArgs,
  isErrorProp,
  onChangeProp = "onChange",
  required,
  trim,
  type = "text",
  valueProp = "value",
  visibilityController,
  ...rest
}) {
  const {
    disabled,
    getOneField,
    getOneVisited,
    isSubmitting,
    schemaValidation,
    setOneError,
    setOneField,
    setOneVisited,
  } = useFrmX()

  const visible = useMemo(() => {
    if (!!visibilityController) {
      const { field, value } = visibilityController
      return !!(getOneField(field) === value)
    } else {
      return true
    }
  }, [getOneField, visibilityController])
  const value = useMemo(() => getOneField(field), [getOneField, field])
  const visited = useMemo(() => getOneVisited(field), [getOneVisited, field])

  const arrx = useArrX()

  const validationMethod = useMemo(() => getValidationMethod(arrx, field, schemaValidation), [getValidationMethod, schemaValidation])
  const isError = useMemo(() => !!validationMethod ? !validationMethod(value) : false, [value])

  useEffect(() => setOneError(field, isError), [setOneError, field, isError, value])

  const onChange = (...args) => {
    let val = !!getValueFromArgs ? getValueFromArgs(args) : type === "checkbox" ? args[0].target.checked : args[0].target.value
    setOneField(field, !!trim && typeof val === 'string' ? val.trim() : val, afterChange)
    if (!!afterChange) afterChange(field, val)
  }

  const onBlur = () => {
    setOneVisited(field)
  }

  const props = useMemo(() => ({
    type,
    onBlur,
    onChange,
    required,
    disabled: isSubmitting || disabled || manuallyDisabled,
    [type === "checkbox" ? "checked" : "value"]: value,
    ...(isErrorProp ? { [isErrorProp]: isError && visited ? true : false } : {}),
    ...(autoCorrectOff && { autoCorrect: "off" }),
    ...(autoCapitalizeOff && { autoCapitalize: "none" }),
    ...rest
  }), [value, visited, isError, field, type, onBlur, onChange, required, isSubmitting, autoCorrectOff, autoCapitalizeOff, rest])

  return useMemo(() => {
    return visible ? Children.only(children) && Children.map(children, child => cloneElement(child, props)) : null
  }, [value, visited, isError, isSubmitting, visible])
}
