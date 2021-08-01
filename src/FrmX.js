import React, { useState, useMemo, useCallback } from "react";
import { FrmXContext } from "./FrmXContext"
import { get, set, setWith, cloneDeep } from "lodash"
import { isParentObject } from './utils/objectUtils'
import { getValidationMethod } from "./utils/getValidationMethod"

export default function FrmX({
  initialValues = {},
  onSubmit,
  onReset,
  className,
  children,
  onInvalidSubmit,
  disabledIf,
  schemaValidation,
  updatesOnly,
  autoCompleteOff,
  disableSubmitIfInvalid,
  disableIfNoUpdates,
  renderDiv,
  clearAfterSubmit
}) {
  const [fields, setFields] = useState(cloneDeep(initialValues))
  const [updates, setUpdates] = useState({})
  const [visited, setVisited] = useState({})
  const [errors, setErrors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasUpdates = useMemo(() => Object.keys(updates).length > 0, [updates])

  const isValidForm = useMemo(() => {
    return errors.length < 1
  }, [schemaValidation, fields, errors, visited, updates])

  const isConditionnallyDisabled = useMemo(() => {
    return !!disabledIf ? disabledIf(fields) : false
  }, [fields, updates])

  const handleError = (field, isError) => {
    if (isError) setErrors(prev => {
      if (!prev.includes(field)) prev.push(field)
      return prev
    })
    else return setErrors(prev => prev.filter(path => path !== field))
  }

  const handleChange = (e, arrx = undefined) => {
    const target = e.target
    const field = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value

    // Check that type of parents for fields whose property name is a number
    // We don't need setWith here as fields are already a clone of initialValues
    setFields(prev => set({ ...prev }, field, value))
    setUpdates(prev => setWith({ ...prev }, field, value, isParentObject(fields, field) ? Object : undefined))
    const method = getValidationMethod(arrx, field, schemaValidation)
    handleError(field, method ? !method(value) : false)
  }

  const handleBlur = e => {
    const target = e.target
    const field = target.name
    setVisited(prev => setWith({ ...prev }, field, true, isParentObject(fields, field) ? Object : undefined))
  }

  const resetForm = e => {
    e.preventDefault()
    setUpdates({})
    setVisited({})
    setFields(() => cloneDeep(initialValues))
    if (onReset) onReset(updatesOnly ? updates : fields)
  }

  const handleSubmit = e => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!isValidForm && onInvalidSubmit || updatesOnly && Object.keys(updates).length < 1) {
      onInvalidSubmit()
    } else {
      setUpdates({})
      setVisited({})
      setErrors([])
      onSubmit(updatesOnly ? updates : fields)
      if (clearAfterSubmit) resetForm()
    }

    setIsSubmitting(false)
  }

  // Functions intended to be used with the useFrmX hook in fields
  const getOneField = field => get(fields, field)
  const setOneField = (field, value) => {
    setFields(prev => set({ ...prev }, field, value))
    setUpdates(prev => setWith({ ...prev }, field, value, isParentObject(fields, field) ? Object : undefined))
  }
  const getOneVisited = field => get(visited, field)
  const setOneVisited = field => setVisited(prev => setWith({ ...prev }, field, true, isParentObject(fields, field) ? Object : undefined))
  const getOneError = field => errors.includes(field)
  const getIsSubmitting = () => isSubmitting

  return <FrmXContext.Provider value={{
    fields,
    visited,
    handleBlur,
    handleChange,
    hasUpdates,
    setOneField,
    getOneField,
    getOneVisited,
    setOneVisited,
    getOneError,
    setOneError: handleError,
    getIsSubmitting,
    disableIfNoUpdates,
    handleSubmit,
    isSubmitting,
    isValidForm,
    disableSubmitIfInvalid,
    schemaValidation,
    isConditionnallyDisabled,
    resetForm,
    renderDiv
  }}>
    {(() => {
      if (!renderDiv) {
        return <form
          className={className}
          onSubmit={handleSubmit}
          noValidate
          autoComplete={autoCompleteOff ? "off" : "on"}
        >
          {children}
        </form>
      } else {
        return <div className={className}>
          {children}
        </div>
      }
    })()}

  </FrmXContext.Provider>
};
