import cloneDeep from 'lodash-es/cloneDeep'
import { cloneElement, Children, useEffect, useMemo, useState } from 'react'

import { useFrmX, useArrX } from './Contexts'
import { on } from './utils/events'
import { getValidationMethod } from './utils/getValidationMethod'

// TODO: Trim values when submitting based on prop && if type is text
export default function FldX({
  afterChange,
  autoCapitalizeOff = false,
  autoCorrectOff = false,
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
  ...rest
}) {
  const {
    disabled,
    formId,
    getOneField,
    isSubmitting,
    schemaValidation,
    setOneError,
    setOneField,
    setOneVisited,
  } = useFrmX()

  const validationMethod = useMemo(() => getValidationMethod(arrx, field, schemaValidation), [getValidationMethod, schemaValidation])
  const [value, setValue] = useState(cloneDeep(getOneField(field)))
  const [visited, setVisited] = useState(false)
  const [error, setError] = useState(false)

  const handleError = (newVal) => {
    if (!!validationMethod) {
      const isError = !validationMethod(newVal)
      setError(isError)
      setOneError(field, isError)
    }
  }

  useEffect(() => setTimeout(() => handleError(value), 0), [])
  useEffect(() => on(`form-${formId}-reset`, () => {
    setValue(cloneDeep(getOneField(field)))
    handleError(value)
  }))

  const arrx = useArrX()

  const onChange = (...args) => {
    let val = !!getValueFromArgs ? getValueFromArgs(args) : type === "checkbox" ? args[0].target.checked : args[0].target.value
    val = !!trim && typeof val === 'string' ? val.trim() : val

    setValue(val)
    setOneField(field, val)
    handleError(val)

    if (!!afterChange) afterChange(field, val)
  }

  const onBlur = () => {
    setVisited(true)
    setOneVisited(field)
  }

  const props = useMemo(() => ({
    type,
    onBlur,
    onChange,
    required,
    disabled: isSubmitting || disabled || manuallyDisabled,
    [type === "checkbox" ? "checked" : "value"]: value,
    ...(isErrorProp ? { [isErrorProp]: error && visited ? true : false } : {}),
    ...(autoCorrectOff && { autoCorrect: "off" }),
    ...(autoCapitalizeOff && { autoCapitalize: "none" }),
    ...rest
  }), [value, visited, error, field, type, onBlur, onChange, required, isSubmitting, autoCorrectOff, autoCapitalizeOff, rest])

  return useMemo(() => {
    return Children.only(children) && Children.map(children, child => cloneElement(child, props))
  }, [value, visited, error, isSubmitting])
}
