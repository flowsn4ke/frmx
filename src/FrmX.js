import React, { useState } from "react";
import { FrmXContext } from "./FrmXContext"
import _ from "lodash"

export default function FrmX({
  initialValues,
  onSubmit,
  className,
  children,
  updatesOnly = false,
  autoCompleteOff = false,
}) {
  const [fields, setFields] = useState(initialValues || {})
  const [updates, setUpdates] = useState({})
  const [visited, setVisited] = useState({})
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    isSubmitting
  }}>
    <form className={className} onSubmit={handleSubmit} noValidate autoComplete={autoCompleteOff ? "off" : "on"}>
      {children}
    </form>
  </FrmXContext.Provider>
};
