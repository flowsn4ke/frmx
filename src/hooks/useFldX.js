import cloneDeep from 'lodash-es/cloneDeep'
import { useState, useRef, useEffect } from 'react'
import { useArrX, useFrmX } from '../Contexts'
import { devEnvOnlyWarn, noProviderFor } from '../utils/dx'
import { resetEvent } from '../events/eventNames'
import { getValidationMethod } from '../utils/getValidationMethod'
import useDocumentListener from './useDocumentListener'

export default function useFldX(field, config = {}) {
  const frmx = useFrmX()

  if (!frmx) {
    if (!config?.native) noProviderFor('the useFldX() hook')
    return undefined
  }

  const {
    disabled: formIsDisabled,
    fields: formFields,
    formId,
    getOneField,
    hasProperty,
    schemaValidation,
    setOneError,
    setOneField,
  } = frmx

  useEffect(() => !hasProperty(field) && devEnvOnlyWarn(`The field '${field}' you're trying to access doesn't exist in the initialValues you provided to the FrmX component. Fix it to avoid bugs.`), [])

  const arrx = useArrX()
  const validationMethod = useRef(getValidationMethod(arrx, field, schemaValidation))

  const [value, setValue] = useState(cloneDeep(getOneField(field)))
  const [onceValid, setOnceValid] = useState(!validationMethod.current)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState(false)

  const handleError = useRef((newVal) => {
    if (!!validationMethod.current) {
      const isError = !validationMethod.current(newVal, formFields)
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
  useDocumentListener(resetEvent(formId), handleReset.current)

  const handleChange = useRef((next) => {
    next = typeof next === 'function' ? next(value) : next
    next = !!config?.trim && typeof next === 'string' ? next.trim() : next
    setValue(next)
    setOneField(field, next)
    handleError.current(next)

    if (config?.afterChange && typeof config?.afterChange === 'function') config.afterChange(next, field)
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
