import React, { useState, useMemo } from "react";
import { FrmXContext } from "./FrmXContext"
import { get, set, setWith, cloneDeep } from "lodash"
import { makeRecursiveKeyList, isParentObject } from './utils/objectUtils'

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
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Also update saved values in the form to untouched values after submission
  const validationMethodsPaths = makeRecursiveKeyList(schemaValidation)

  // Add check for errors if
  const isValidForm = useMemo(() => {
    let isValid = true

    if (updatesOnly && Object.keys(updates).length < 1) isValid = false

    validationMethodsPaths.forEach(path => {
      const method = get(schemaValidation, path)
      if (!method(get(fields, path))) isValid = false
    })

    return isValid
  }, [fields, updates])

  const isConditionnallyDisabled = useMemo(() => {
    return !!disabledIf ? disabledIf(fields) : false
  }, [fields, updates])

  const handleChange = (e) => {
    const target = e.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value

    // Check that type of parents for fields whose property name is a number
    // We don't need setWith here as fields are already a clone of initialValues
    setFields(prev => set({ ...prev }, name, value))
    setUpdates(prev => setWith({ ...prev }, name, value, isParentObject(fields, name) ? Object : undefined))
  }

  const handleBlur = (e) => {
    const target = e.target
    const name = target.name
    setVisited(prev => setWith({ ...prev }, name, true, isParentObject(fields, name) ? Object : undefined))
  }


  const handleError = (name, isError) => {
    setErrors(prev => setWith({ ...prev }, name, isError, isParentObject(fields, name) ? Object : undefined))
  }

  const resetForm = () => {
    setUpdates({})
    setVisited({})
    setFields(() => initialValues)
    if (onReset) onReset(updatesOnly ? updates : fields)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!isValidForm && onInvalidSubmit) {
      onInvalidSubmit()
    } else {
      setUpdates({})
      setVisited({})
      onSubmit(updatesOnly ? updates : fields)
      if (clearAfterSubmit) resetForm()
    }
    // Add check that the button does have the id we gave it (random Id, nanoID)
    // before submitting, avoiding conflicts with other buttons in the form with type of "submit"?

    setIsSubmitting(false)
  }

  // Functions intended to be used with the useFrmX hook in fields
  const getOneField = (field) => get(fields, field)
  const setOneField = (field, value) => {
    setFields(prev => set({ ...prev }, field, value))
    setUpdates(prev => setWith({ ...prev }, field, value, isParentObject(fields, name) ? Object : undefined))
  }
  const getOneVisited = (field) => get(visited, field)
  const setOneVisited = (field) => setVisited(prev => setWith({ ...prev }, field, true, isParentObject(fields, name) ? Object : undefined))
  const getOneError = (field) => get(errors, field)
  const setOneError = (field, isError) => setErrors(prev => setWith({ ...prev }, field, isError, isParentObject(fields, name) ? Object : undefined))
  const getIsSubmitting = () => isSubmitting

  return <FrmXContext.Provider value={{
    fields,
    setOneField,
    getOneField,
    visited,
    getOneVisited,
    setOneVisited,
    getOneError,
    setOneError,
    getIsSubmitting,
    errors,
    updates,
    disableIfNoUpdates,
    handleChange,
    handleBlur,
    handleError,
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
