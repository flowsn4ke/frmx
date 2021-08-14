import cloneDeep from 'lodash-es/cloneDeep'
import { cloneElement, Children, useEffect, useMemo, useState, useRef } from 'react'

import { useFrmX, useArrX } from './Contexts'
import { getValidationMethod } from './utils/getValidationMethod'

// TODO: Trim values when submitting based on prop && if type is text
export default function FldX({
  afterChange,
  autoCapitalizeOn,
  autoCompleteOff,
  autoCorrectOn,
  children,
  disabled: locallyDisabled,
  field,
  getValueFromArgs,
  // TODO: Rename to errorProp in V4
  isErrorProp,
  onChangeProp = "onChange",
  spellCheckOn,
  trim,
  type = "text",
  valueProp = "value",
  ...rest
}) {
  const {
    disabled: formIsDisabled,
    getOneField,
    schemaValidation,
    setOneError,
    setOneField,
    useResetListener
  } = useFrmX()

  const arrx = useArrX()

  const validationMethod = useMemo(() => getValidationMethod(arrx, field, schemaValidation), [getValidationMethod, schemaValidation])

  const [value, setValue] = useState(cloneDeep(getOneField(field)))
  const [onceValid, setOnceValid] = useState(!validationMethod)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState(false)

  const handleError = useRef((newVal) => {
    if (!!validationMethod) {
      const isError = !validationMethod(newVal)
      if (!onceValid && !isError) setOnceValid(true)
      setError(isError)
      setOneError(field, isError)
    }
  })
  useEffect(() => {
    handleError.current(value)
    return () => setOneError(field, false)
  }, [])

  const handleReset = useRef(() => {
    setValue(cloneDeep(getOneField(field)))
    handleError.current(value)
  })
  useResetListener(handleReset.current)

  const onChange = useRef((...args) => {
    let val = !!getValueFromArgs ? getValueFromArgs(args) : type === "checkbox" ? args[0].target.checked : args[0].target.value
    val = !!trim && typeof val === 'string' ? val.trim() : val

    setValue(val)
    setOneField(field, val)
    handleError.current(val)

    if (!!afterChange) afterChange(field, val)
  })

  const onBlur = useRef(() => setTouched(true))

  const props = {
    type,
    onBlur: onBlur.current,
    onChange: onChange.current,
    disabled: formIsDisabled || locallyDisabled,
    [type === "checkbox" ? "checked" : "value"]: value,
    ...(isErrorProp ? { [isErrorProp]: error && (onceValid || touched) ? true : false } : {}),
    ...(!autoCorrectOn && { autoCorrect: "off" }),
    ...(!autoCapitalizeOn && { autoCapitalize: "none" }),
    ...(!spellCheckOn && { spellCheck: "false" }),
    ...(autoCompleteOff && { autoComplete: "off" }),
    ...rest
  }

  return Children.only(children) && Children.map(children, child => cloneElement(child, props))
}
