import React, { useRef } from 'react'
import get from 'lodash-es/get'
import set from 'lodash-es/set'
import has from 'lodash-es/has'
import cloneDeep from 'lodash-es/cloneDeep'
import { nanoid } from 'nanoid'

import { FormContext } from './Contexts'
import { getDiffAlg } from './utils/diff'
import { trigger } from './events/utils'
import { resetEvent, setEvent, submitEvent } from './events/eventNames'

export default function Form({
  afterChange,
  autoCompleteOff,
  children,
  clearAfterSubmit,
  diff,
  disabled,
  disabledIf,
  disableIfNoUpdates,
  disableIfInvalid,
  initialValues = {},
  onInvalidSubmit,
  onReset,
  onSubmit,
  renderDiv,
  schemaValidation = {},
  ...rest
}) {
  const fields = useRef(cloneDeep(initialValues))
  const observers = useRef(new Set())
  const updated = useRef(new Set())
  const errors = useRef(new Set())
  const isSubmitting = useRef(false)
  const formId = useRef(nanoid())
  const diffAlg = useRef(getDiffAlg(diff))
  // Read-only proxy. See https://javascript.info/proxy
  const fieldsProxy = useRef(new Proxy(fields.current, {
    get: (o, p) => get(o, p),
    set: () => null,
    deleteProperty: () => null,
  }))

  const hasProperty = (path) => has(fieldsProxy.current, path)
  const hasUpdates = () => updated.current.size > 0
  const hasErrors = () => errors.current.size > 0

  const getFields = () => fieldsProxy.current
  // TODO: Add to the doc
  const getErrors = () => new Set(errors.current)

  const getOneField = (field) => get(fields.current, field)
  const setOneField = (field, value) => {
    set(fields.current, field, value)
    setOneUpdated(field)

    observers.current.has(field) && trigger(setEvent(formId.current, field), value)
    // TODO: Update the API
    !!afterChange && afterChange(fields.current, field, hasErrors, getErrors())
  }

  const getOneUpdated = (field) => updated.current.has(field)
  const setOneUpdated = (field) => {
    if (!updated.current.has(field)) updated.current.add(field)
  }

  const getOneError = (field) => errors.current.has(field)
  const setOneError = (field, isError) => {
    if (isError && !errors.current.has(field)) {
      errors.current.add(field)
    } else if (!isError && errors.current.has(field)) {
      errors.current.delete(field)
    }
  }

  const registerFieldObserver = (field) => !observers.current.has(field) && observers.current.add(field)

  const resetForm = () => {
    if (onReset && hasUpdates()) onReset(diffAlg.current(initialValues, fields.current))
    updated.current = new Set()
    fields.current = cloneDeep(initialValues)
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
      (!!disabledIf && disabledIf(diffAlg.current(initialValues, fields.current)))
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
    hasProperty,
    fieldsProxy: fieldsProxy.current,
    getErrors,
    getFields,
    getOneField,
    getOneUpdated,
    getOneError,
    hasProperty,
    hasUpdates,
    hasErrors,
    registerFieldObserver,
    renderDiv,
    resetForm,
    setOneError,
    setOneField,
    setOneUpdated,
    schemaValidation,
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
