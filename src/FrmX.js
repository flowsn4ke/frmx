import React, { useState, useMemo } from "react";
import { FrmXContext } from "./FrmXContext"
import _ from "lodash"
import { makeRecursiveKeyList } from './utils/objectUtils'

export default function FrmX({
  initialValues,
  onSubmit,
  className,
  children,
  onInvalidSubmit,
  schemaValidation,
  updatesOnly = false,
  autoCompleteOff = false,
  disableSubmitIfInvalid = false,
  disableIfNoUpdates = false
}) {
  const [fields, setFields] = useState(initialValues || {})
  const [updates, setUpdates] = useState({})
  const [visited, setVisited] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Also update saved values in the form to untouched values after submission
  let untouchedValues = _.cloneDeep(initialValues)

  const validationMethodsPaths = makeRecursiveKeyList(schemaValidation)

  const isValidForm = useMemo(() => {
    let isValid = true

    if (updatesOnly && Object.keys(updates).length < 1) isValid = false

    validationMethodsPaths.forEach(path => {
      const method = _.get(schemaValidation, path)
      if (!method(_.get(fields, path))) isValid = false
    })

    return isValid
  }, [fields, updates])

  const handleChange = (e) => {
    const target = e.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value

    if (updatesOnly) setUpdates(prev => _.set({ ...prev }, name, value))

    setFields(prev => _.set({ ...prev }, name, value))
  }

  const handleBlur = (e) => {
    const target = e.target
    const name = target.name
    setVisited(prev => _.set({ ...prev }, name, true))
  }

  const handleError = (name, isError) => {
    setErrors(prev => _.set({ ...prev }, name, isError))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!isValidForm && onInvalidSubmit) {
      onInvalidSubmit()
    } else {
      setUpdates(_ => { })
      setErrors(_ => { })
      untouchedValues = _.cloneDeep(fields)
      onSubmit(updatesOnly ? updates : fields)
    }
    // Add check that the button does have the id we gave it (random Id, nanoID)
    // before submitting, avoiding conflicts with other buttons in the form with type of "submit"?

    setIsSubmitting(false)
  }

  const resetForm = () => {
    setFields(_ => untouchedValues)
    setUpdates(_ => { })
    setErrors(_ => { })
  }

  // Functions intended to be used with the useFrmX hook
  const getOneField = (field) => _.get(fields, field)
  const setOneField = (field, value) => setFields(prev => _.set({ ...prev }, field, value))
  const getOneVisited = (field) => _.get(visited, field)
  const setOneVisited = (field) => setVisited(prev => _.set({ ...prev }, field, true))
  const getOneError = (field) => _.get(errors, field)
  const setOneError = (field, isError) => setErrors(prev => _.set({ ...prev }, field, isError))
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
    isSubmitting,
    isValidForm,
    disableSubmitIfInvalid,
    schemaValidation,
    resetForm
  }}>
    <form className={className} onSubmit={handleSubmit} noValidate autoComplete={autoCompleteOff ? "off" : "on"}>
      {children}
    </form>
  </FrmXContext.Provider>
};
