import { useState, useRef, useEffect } from 'react'
import { useArray, useForm } from '../Contexts'
import { noProviderFor } from '../utils/dx'
import { getValidationMethod } from '../utils/getValidationMethod'
import useSubmitListener from './useSubmitListener'
import useResetListener from './useResetListener'

export default function useField(path, config = {}) {
  const frmx = useForm()

  if (!frmx) {
    if (!config?.native) noProviderFor(`the useFldX() hook at the input controlling the ${path} field`)
    return undefined
  }

  const {
    disabled: formIsDisabled,
    getFields,
    getOneField,
    schemaValidation,
    setOneError,
    setOneField,
  } = frmx

  const arrx = useArray()
  const validationMethod = useRef(getValidationMethod(arrx, path, schemaValidation))

  const [value, setValue] = useState(getOneField(path))
  const [onceValid, setOnceValid] = useState(!validationMethod.current)
  const [touched, setTouched] = useState(false)
  const [submittedOnce, setSubmittedOnce] = useState(false)
  const [error, setError] = useState(false)

  const handleError = (newVal) => {
    if (!!validationMethod.current && typeof validationMethod.current === 'function') {
      const isError = !validationMethod.current(newVal, getFields())
      if (!onceValid && !isError) setOnceValid(true)
      setError(isError)
      setOneError(path, isError)
    }
  }
  useEffect(() => {
    handleError(value)
    return () => setOneError(path, false)
  }, [])

  const handleReset = () => {
    setValue(getOneField(path))
    setSubmittedOnce(false)
    setOnceValid(false)
    setTouched(false)
    handleError(value)
  }
  useResetListener(handleReset)

  const handleSubmit = () => {
    setSubmittedOnce(true)
    handleError(getOneField(path))
  }
  useSubmitListener(handleSubmit)

  const handleChange = (next) => {
    next = typeof next === 'function' ? next(value) : next
    next = !!config?.trim && typeof next === 'string' ? next.trim() : next
    setValue(next)
    handleError(next)
    setOneField(path, next)
    if (config?.afterChange && typeof config?.afterChange === 'function') config.afterChange(next, path, error)
  }

  const onBlur = () => setTouched(true)

  return {
    value,
    setValue: handleChange,
    error: error && (onceValid || touched || submittedOnce),
    disabled: formIsDisabled || config?.disabled,
    onBlur
  }
}
