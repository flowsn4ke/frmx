import cloneDeep from 'lodash-es/cloneDeep'
import { cloneElement, Children, useEffect, useMemo, useState } from 'react'

import { useFrmX, useArrX } from './Contexts'
import useDocumentListener from './hooks/useDocumentListener'
import { getValidationMethod } from './utils/getValidationMethod'

// TODO: Trim values when submitting based on prop && if type is text
export default function FldX({
  afterChange,
  autoCapitalizeOff = false,
  autoCorrectOff = false,
  children,
  disabled: locallyDisabled,
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
    disabled: formIsDisabled,
    formId,
    getOneField,
    isSubmitting,
    schemaValidation,
    setOneError,
    setOneField,
    setOneVisited,
  } = useFrmX()

  const arrx = useArrX()

  const validationMethod = useMemo(() => getValidationMethod(arrx, field, schemaValidation), [getValidationMethod, schemaValidation])

  const [value, setValue] = useState(cloneDeep(getOneField(field)))
  const [onceValid, setOnceValid] = useState(!validationMethod)
  const [error, setError] = useState(false)

  const handleError = (newVal) => {
    if (!!validationMethod) {
      const isError = !validationMethod(newVal)
      if (!onceValid && !isError) setOnceValid(true)
      setError(isError)
      setOneError(field, isError)
    }
  }
  useEffect(() => setTimeout(() => handleError(value), 0), [])

  const handleReset = () => {
    setValue(cloneDeep(getOneField(field)))
    handleError(value)
  }
  useDocumentListener(`form-${formId}-reset`, handleReset)

  const onChange = (...args) => {
    let val = !!getValueFromArgs ? getValueFromArgs(args) : type === "checkbox" ? args[0].target.checked : args[0].target.value
    val = !!trim && typeof val === 'string' ? val.trim() : val

    setValue(val)
    setOneField(field, val)
    handleError(val)

    if (!!afterChange) afterChange(field, val)
  }

  const props = {
    type,
    onChange,
    required,
    disabled: formIsDisabled || locallyDisabled,
    [type === "checkbox" ? "checked" : "value"]: value,
    ...(isErrorProp ? { [isErrorProp]: error && onceValid ? true : false } : {}),
    ...(autoCorrectOff && { autoCorrect: "off" }),
    ...(autoCapitalizeOff && { autoCapitalize: "none" }),
    ...rest
  }

  return Children.only(children) && Children.map(children, child => cloneElement(child, props))
}
