import cloneDeep from 'lodash-es/cloneDeep'
import { useState, useRef, useEffect } from 'react'
import { useArrX, useFrmX } from '../Contexts'
import { getValidationMethod } from '../utils/getValidationMethod'

export default function useFldX(field, config = {}) {
  const {
    disabled: formIsDisabled,
    getOneField,
    schemaValidation,
    setOneError,
    setOneField,
    useResetListener
  } = useFrmX()

  const arrx = useArrX()
  const validationMethod = useRef(getValidationMethod(arrx, field, schemaValidation))

  const [value, setValue] = useState(cloneDeep(getOneField(field)))
  const [onceValid, setOnceValid] = useState(!validationMethod.current)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState(false)

  const handleError = useRef((newVal) => {
    if (!!validationMethod.current) {
      const isError = !validationMethod.current(newVal)
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

  const handleChange = useRef((val) => {
    val = typeof val === "function" ? val(value) : val
    val = !!config?.trim && typeof val === 'string' ? val.trim() : val
    setValue(val)
    setOneField(field, val)
    handleError.current(val)

    if (!!config?.afterChange && typeof config?.afterChange === "function") config.afterChange(field, val)
  })

  const onBlur = useRef(() => setTouched(true))

  return {
    value,
    setValue: handleChange.current,
    error: error && (onceValid || touched),
    disabled: formIsDisabled || config?.disabled,
    onBlur: onBlur.current,
  }
}
