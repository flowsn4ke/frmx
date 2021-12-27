import React, { useEffect, useRef } from 'react'
import clone from './utils/clone'
import { nanoid } from 'nanoid'

import { FormContext } from './Contexts'
import { getDiffAlg } from './utils/diff'
import { trigger } from './events/utils'
import { resetEvent, setEvent, submitEvent } from './events/eventNames'
import Proxify from "proxur"

// TODO: Make a custom clone deep function: no more lodash! Uninstall it!

export default function Form({
  afterChange,
  autoCompleteOff,
  children,
  clearAfterSubmit,
  diff,
  disabled,
  disableIf,
  disableIfNoUpdates,
  disableIfInvalid,
  initialValues = {},
  onInvalidSubmit,
  onReset,
  onSubmit,
  renderDiv,
  refreshInitialValues,
  schemaValidation = {},
  ...rest
}) {
  const fields = useRef(Proxify(clone(initialValues)))
  const validation = useRef(Proxify(schemaValidation))
  const observers = useRef(new Set())
  const updated = useRef(new Set())
  const errors = useRef(new Set())
  const isSubmitting = useRef(false)
  const formId = useRef(nanoid())
  // TODO: Feed the original object to the diff alg?
  const diffAlg = useRef(getDiffAlg(diff))
  // Read-only proxy. See https://javascript.info/proxy

  // We need to make validation a proxy as well so we can access its methods in the same way

  useEffect(() => {
    fields.current = Proxify(clone(initialValues))
    validation.current = Proxify(schemaValidation)
  }, [initialValues])

  const hasUpdates = () => updated.current.size > 0
  const hasErrors = () => errors.current.size > 0

  const getFields = () => fields.current
  // TODO: Add to the doc
  const getErrors = () => new Set(errors.current)

  const getOneField = (field) => fields.current[field]
  const setOneField = (field, value) => {

    //! We only need to keep track of validation for validation purposes,
    //! TODO not to prevent setting a value! Any value should be permitted!
    // TODO: Check the validation method first?
    // Although we are checking that in the field at the moment :/
    // TODO: Replace lodash in the getValidationMethod method
    // TODO: Set the fields based on a callback again in components' useStates?
    fields.current[field] = value
    setOneUpdated(field)

    // TODO: Stop using events to handle observers?
    observers.current.has(field) && trigger(setEvent(formId.current, field), value)
    // TODO: Update the API
    !!afterChange && afterChange(fields.current, field, hasErrors(), getErrors())
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
    if (onReset && hasUpdates()) onReset(diffAlg.current(initialValues, fields.current))
    updated.current = new Set()
    fields.current = Proxify(clone(initialValues))
    trigger(resetEvent(formId.current))
  }

  const handleSubmit = (e) => {
    e?.preventDefault()
    if (isSubmitting.current === true) return

    if ((disableIfNoUpdates || !!diff) && !hasUpdates()) {
      trigger(submitEvent(formId.current))
      return
    } else if (
      ((disableIfInvalid || onInvalidSubmit) && hasErrors()) ||
      (!!disableIf && disableIf(diffAlg.current(initialValues, fields.current)))
    ) {
      trigger(submitEvent(formId.current))
      if (!!onInvalidSubmit && typeof onInvalidSubmit === 'function') onInvalidSubmit()
    } else {
      isSubmitting.current = true
      updated.current = new Set()
      errors.current = new Set()
      onSubmit(diffAlg.current(initialValues, fields.current))
      if (clearAfterSubmit) resetForm()
    }

    isSubmitting.current = false
  }

  return <FormContext.Provider value={{
    disabled,
    formId: formId.current,
    handleSubmit,
    fields: fields.current,
    getErrors,
    getFields,
    getOneField,
    getOneUpdated,
    getOneError,
    hasUpdates,
    hasErrors,
    registerFieldObserver,
    renderDiv,
    resetForm,
    setOneError,
    setOneField,
    setOneUpdated,
    schemaValidation: validation.current,
  }}>
    {(() => {
      if (!renderDiv) {
        return <form
          noValidate
          autoComplete={autoCompleteOff ? "off" : "on"}
          onSubmit={handleSubmit}
          {...rest}
        >
          {children}
        </form>
      } else {
        return <div {...rest}>
          {children}
        </div>
      }
    })()}
  </FormContext.Provider>
}
