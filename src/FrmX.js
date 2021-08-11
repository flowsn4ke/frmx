import React, { useState, useMemo, useCallback } from 'react'
import get from 'lodash-es/get'
import set from 'lodash-es/set'
import setWith from 'lodash-es/setWith'
import cloneDeep from 'lodash-es/cloneDeep'

import { FrmXContext } from './Contexts'
import { isParentObject } from './utils/objectUtils'

export default function FrmX({
  afterChange,
  autoCompleteOff,
  onSubmit,
  children,
  className,
  clearAfterSubmit,
  disabled,
  disabledIf,
  disableIfNoUpdates,
  disableSubmitIfInvalid,
  initialValues = {},
  onInvalidSubmit,
  onReset,
  renderDiv,
  schemaValidation,
  style,
  updatesOnly,
}) {
  const [fields, setFields] = useState(cloneDeep(initialValues))
  const [updates, setUpdates] = useState({})
  const [visited, setVisited] = useState(new Set())
  const [errors, setErrors] = useState(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Functions intended to be used with the useFrmX hook in fields
  const getOneField = useCallback((field) => get(fields, field), [get, fields])
  const setOneField = useCallback((field, value) => {
    setFields(prev => {
      const next = set({ ...prev }, field, value)
      if (!!afterChange) afterChange(next)
      return next
    })
    setUpdates(prev => {
      const next = setWith({ ...prev }, field, value, isParentObject(fields, field) ? Object : undefined)
      return next
    })
  }, [setFields, setUpdates, get, set, setWith, fields])

  const getOneVisited = useCallback((field) => visited.has(field), [visited])
  const setOneVisited = useCallback((field) => {
    setVisited(prev => {
      if (!prev.has(field)) {
        const next = new Set(prev)
        next.add(field)
        return next
      } else {
        return prev
      }
    })
  }, [setVisited, visited])

  const getOneError = useCallback((field) => errors.has(field), [errors])
  const setOneError = useCallback((field, isError) => {
    setErrors(prev => {
      const next = new Set(prev)
      if (isError && !prev.has(field)) {
        next.add(field)
        return next
      } else if (!isError && prev.has(field)) {
        next.delete(field)
        return next
      } else {
        return prev
      }
    })
  }, [setErrors, errors])

  const hasUpdates = useMemo(() => Object.keys(updates).length > 0, [updates])
  const isValidForm = useMemo(() => errors.size < 1, [schemaValidation, fields, errors, visited, updates])
  const isConditionnallyDisabled = useMemo(() => !!disabled || (!!disabledIf ? disabledIf(fields) : false), [fields, updates, disabled])

  const resetForm = () => {
    setUpdates({})
    setVisited(new Set())
    setFields(() => cloneDeep(initialValues))
    if (onReset) onReset(updatesOnly ? updates : fields)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (
      ((updatesOnly || disableIfNoUpdates) && !hasUpdates) ||
      ((disableSubmitIfInvalid || onInvalidSubmit) && !isValidForm)
    ) {
      if (!!onInvalidSubmit) onInvalidSubmit()
    } else {
      setUpdates({})
      setVisited(new Set())
      setErrors(new Set())
      onSubmit(updatesOnly ? updates : fields)
      if (clearAfterSubmit) resetForm()
    }
    setIsSubmitting(false)
  }

  return <FrmXContext.Provider value={{
    disabled,
    disableIfNoUpdates,
    disableSubmitIfInvalid,
    handleSubmit,
    hasUpdates,
    isConditionnallyDisabled,
    isSubmitting,
    isValidForm,
    getOneField,
    getOneVisited,
    getOneError,
    renderDiv,
    resetForm,
    setOneError,
    setOneField,
    setOneVisited,
    schemaValidation,
  }}>
    {(() => {
      if (!renderDiv) {
        return <form
          className={className}
          style={style}
          onSubmit={handleSubmit}
          noValidate
          autoComplete={autoCompleteOff ? "off" : "on"}
        >
          {children}
        </form>
      } else {
        return <div className={className} style={style}>
          {children}
        </div>
      }
    })()}
  </FrmXContext.Provider>
}
