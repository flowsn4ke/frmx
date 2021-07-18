import React, { useState, useMemo } from "react";
import { FrmXContext } from "./FrmXContext"
import _ from "lodash"

// TODO: Add callback fn to do smthg when submitting when incorrect field values?
export default function FrmX({
  initialValues,
  onSubmit,
  className,
  children,
  updatesOnly = false,
  autoCompleteOff = false,
  isDisabled
}) {
  const [fields, setFields] = useState(initialValues || {})
  const [updates, setUpdates] = useState({})
  const [visited, setVisited] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isValidForm = useMemo(() => {
    if (isDisabled) return isDisabled(fields)
    else return false
  }, [fields])
  // TODO: Add isValidForm logic prop to pass it down and disable submit buttons
  // TODO: Implement schema validation

  const handleChange = (e) => {
    const target = e.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value

    if (updatesOnly) setUpdates(prev => _.set({ ...prev }, name, value))

    setFields(prev => _.set({ ...prev }, name, value))
  }

  const setOneField = (name, value) => setFields(prev => _.set({ ...prev }, name, value))

  const getOneField = (name) => _.get(fields, name)

  const handleBlur = (e) => {
    const target = e.target
    const name = target.name
    setVisited(prev => _.set({ ...prev }, name, true))
  }

  const setOneVisited = (name) => setVisited(prev => _.set({ ...prev }, name, true))

  const handleError = (name, isError) => setErrors(prev => _.set({ ...prev }, name, isError))

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Add check that the button does have the id we gave it (random Id, nanoID)
    //  before submitting, avoiding conflicts with other buttons in the form
    // TODO: schema validation step happens here

    onSubmit(updatesOnly ? updates : fields)
    setIsSubmitting(false)
  }

  return <FrmXContext.Provider value={{
    fields,
    setOneField,
    getOneField,
    visited,
    setOneVisited,
    errors,
    handleChange,
    handleBlur,
    handleError,
    setOneError: handleError,
    isSubmitting,
    isValidForm
  }}>
    <form className={className} onSubmit={handleSubmit} noValidate autoComplete={autoCompleteOff ? "off" : "on"}>
      {children}
    </form>
  </FrmXContext.Provider>
};
