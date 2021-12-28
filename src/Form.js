import React, { createElement, useEffect, useRef } from 'react'
import { nanoid } from 'nanoid'

import { FormContext } from './Contexts'
import { trigger } from './events/utils'
import { resetEvent, setEvent, submitEvent } from './events/eventNames'
import Proxify from "proxur"
import clone from './utils/clone'

// TODO: Add a special signal so we know setters come from frmx?
// TODO: Update the doc: No more renderDiv or diff, added render, default is div
// TODO: Check render is a legal value, otherwise replace it with "div"

export default function Form({
  afterChange,
  autoCompleteOff,
  children,
  clearAfterSubmit,
  disabled,
  disableIf,
  disableIfNoUpdates,
  disableIfInvalid,
  initialValues = {},
  onInvalidSubmit,
  onReset,
  onSubmit,
  refreshInitialValues,
  schemaValidation = {},
  render = "div",
  ...rest
}) {
  const fields = useRef(Proxify(clone(initialValues)))
  const validation = useRef(Proxify(schemaValidation))
  const observers = useRef(new Set())
  const updated = useRef(new Set())
  const errors = useRef(new Set())
  const isSubmitting = useRef(false)
  const formId = useRef(nanoid())

  useEffect(() => {
    fields.current = Proxify(clone(initialValues))
    validation.current = Proxify(schemaValidation)
  }, [initialValues, schemaValidation])

  const hasUpdates = () => updated.current.size > 0
  const hasErrors = () => errors.current.size > 0

  const getFields = () => fields.current
  // TODO: Add to the doc
  const getErrors = () => new Set(errors.current)

  const getOneField = (field) => fields.current[field]
  const setOneField = (path, value) => {
    fields.current[path] = value
    setOneUpdated(path)
    observers.current.has(path) && trigger(setEvent(formId.current, path), value)
    // TODO: Update the API
    !!afterChange && afterChange(fields.current, path, hasErrors(), getErrors())
  }

  // TODO: Do we actually need those?
  const getOneUpdated = (field) => updated.current.has(field)
  const setOneUpdated = (field) => {
    if (!updated.current.has(field))
      updated.current.add(field)
  }

  // TODO: Do we actually need those?
  const getOneError = (field) => errors.current.has(field)
  const setOneError = (field, isError) => {
    if (isError && !errors.current.has(field)) {
      errors.current.add(field)
    } else if (!isError && errors.current.has(field)) {
      errors.current.delete(field)
    }
  }

  // TODO: Make use of the proxy somehow later on
  const registerFieldObserver = (field) => !observers.current.has(field) && observers.current.add(field)

  const resetForm = () => {
    if (onReset && hasUpdates()) onReset(fields.current)
    updated.current = new Set()
    fields.current = Proxify(clone(initialValues))
    trigger(resetEvent(formId.current))
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (isSubmitting.current === true) return

    if ((disableIfNoUpdates) && !hasUpdates()) {
      trigger(submitEvent(formId.current))
      return
    } else if (
      ((disableIfInvalid || onInvalidSubmit) && hasErrors()) ||
      (!!disableIf && disableIf(clone(initialValues)))
    ) {
      trigger(submitEvent(formId.current))
      if (!!onInvalidSubmit && typeof onInvalidSubmit === 'function') onInvalidSubmit()
    } else {
      isSubmitting.current = true
      updated.current = new Set()
      errors.current = new Set()
      onSubmit(clone(initialValues))
      if (clearAfterSubmit) resetForm()
    }

    isSubmitting.current = false
  }

  const props = {
    ...(render === "form" ? {
      noValidate: true,
      autoComplete: autoCompleteOff ? "off" : "on",
      onSubmit: handleSubmit
    } : {}),
    children,
    ...rest
  }

  return <FormContext.Provider value={{
    disabled,
    formId: formId.current,
    handleSubmit,
    getErrors,
    getFields,
    getOneField,
    getOneUpdated,
    getOneError,
    hasUpdates,
    hasErrors,
    registerFieldObserver,
    render,
    resetForm,
    setOneError,
    setOneField,
    setOneUpdated,
    schemaValidation: validation.current,
  }}>
    {createElement(render, props)}
  </FormContext.Provider>
}
