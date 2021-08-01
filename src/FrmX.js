import React, { useState, useMemo } from "react";
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
  const [visited, setVisited] = useState(new Set())
  const [errors, setErrors] = useState(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasUpdates = useMemo(() => Object.keys(updates).length > 0, [updates])

  const isValidForm = useMemo(() => {
    return errors.size < 1
  }, [schemaValidation, fields, errors, visited, updates])

  const isConditionnallyDisabled = useMemo(() => {
    return !!disabledIf ? disabledIf(fields) : false
  }, [fields, updates])

  const handleError = (field, isError) => {
    const next = new Set(errors)
    if (isError && !errors.has(field)) {
      next.add(field)
      setErrors(next)
    } else if (!isError && errors.has(field)) {
      next.delete(field)
      setErrors(next)
    }
  }

  const handleChange = (e, arrx = undefined) => {
    const target = e.target
    const field = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value

    // Check that type of parents for fields whose property name is a number
    // We don't need setWith here as fields are already a clone of initialValues
    setFields(prev => set({ ...prev }, field, value))
    setUpdates(prev => setWith({ ...prev }, field, value, isParentObject(fields, field) ? Object : undefined))

    const validationMethod = getValidationMethod(arrx, field, schemaValidation)
    handleError(field, validationMethod ? !validationMethod(value) : false)
  }

  const resetForm = () => {
    setUpdates({})
    setVisited(new Set())
    setFields(() => cloneDeep(initialValues))
    if (onReset) onReset(updatesOnly ? updates : fields)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if ((!isValidForm || updatesOnly && Object.keys(updates).length < 1) && onInvalidSubmit) {
      onInvalidSubmit()
    } else {
      setUpdates({})
      setVisited(new Set())
      setErrors(new Set())
      onSubmit(updatesOnly ? updates : fields)
      if (clearAfterSubmit) resetForm()
    }

    setIsSubmitting(false)
  }

  // Functions intended to be used with the useFrmX hook in fields
  const getOneField = (field) => get(fields, field)
  const setOneField = (field, value) => {
    setFields(prev => set({ ...prev }, field, value))
    setUpdates(prev => setWith({ ...prev }, field, value, isParentObject(fields, field) ? Object : undefined))
  }

  const getOneVisited = (field) => visited.has(field)
  const setOneVisited = (field) => {
    if (!visited.has(field)) {
      const next = new Set(visited)
      next.add(field)
      setVisited(next)
    }
  }

  const getOneError = (field) => errors.has(field)
  const getIsSubmitting = () => isSubmitting

  return <FrmXContext.Provider value={{
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
}
