import React, { useRef } from 'react'
import get from 'lodash-es/get'
import set from 'lodash-es/set'
import cloneDeep from 'lodash-es/cloneDeep'
import { nanoid } from 'nanoid'

import { FrmXContext } from './Contexts'
import { shallowDiff, deepDiff } from './utils/diff'
import { trigger } from './utils/events'

const getDiffAlg = (key) => {
  switch (key) {
    case 'shallow': {
      return shallowDiff
    }
    // case 'visited': {
    //   return deepDiffWithFullArrays
    // }
    case 'deep': {
      return deepDiff
    }
    default: {
      return (prev, next) => next
    }
  }
}

export default function FrmX({
  afterChange,
  autoCompleteOff,
  children,
  className,
  clearAfterSubmit,
  diff,
  disabled,
  disabledIf,
  disableIfNoUpdates,
  disableSubmitIfInvalid,
  initialValues = {},
  onInvalidSubmit,
  onReset,
  onSubmit,
  renderDiv,
  schemaValidation,
  style,
  updatesOnly,
}) {
  const original = useRef(cloneDeep(initialValues))
  const fields = useRef(cloneDeep(initialValues))
  const updated = useRef(new Set())
  const errors = useRef(new Set())
  const isSubmitting = useRef(false)
  const formId = useRef(nanoid())
  const diffAlg = useRef(getDiffAlg(diff || updatesOnly ? 'shallow' : ''))

  const hasUpdates = () => updated.current.size > 0
  const hasErrors = () => errors.current.size > 0

  // Functions intended to be used with the useFrmX hook in fields
  const getOneField = (field) => get(fields.current, field)
  const setOneField = (field, value) => {
    set(fields.current, field, value)
    setOneVisited(field)
    if (!!afterChange) afterChange(fields.current)
  }

  const getOneVisited = (field) => updated.current.has(field)
  const setOneVisited = (field) => {
    if (!updated.current.has(field)) updated.current.add(field)
  }

  const getOneError = (field) => errors.current.has(field)
  const setOneError = (field, isError) => {
    if (isError && !errors.current.has(field)) {
      errors.current.add(field)
      trigger(`form-${formId.current}-total-errors`, errors.current.size)
    } else if (!isError && errors.current.has(field)) {
      errors.current.delete(field)
      trigger(`form-${formId.current}-total-errors`, errors.current.size)
    }
  }

  const resetForm = () => {
    if (onReset && hasUpdates()) onReset(diffAlg.current(original.current, fields.current))
    updated.current = new Set()
    fields.current = cloneDeep(original.current)
    trigger(`form-${formId.current}-reset`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isSubmitting.current === true) return

    if ((updatesOnly || disableIfNoUpdates || !!diff) && !hasUpdates()) {
      return
    } else if (
      ((disableSubmitIfInvalid || onInvalidSubmit) && hasErrors()) ||
      (!!disabledIf && disabledIf(diffAlg.current(original.current, fields.current)))
    ) {
      if (!!onInvalidSubmit) onInvalidSubmit()
    } else {
      isSubmitting.current = true
      updated.current = new Set()
      errors.current = new Set()
      onSubmit(diffAlg.current(original.current, fields.current))
      if (clearAfterSubmit) resetForm()
    }

    isSubmitting.current = false
  }

  return <FrmXContext.Provider value={{
    disabled,
    disabledIf,
    disableIfNoUpdates,
    disableSubmitIfInvalid,
    formId: formId.current,
    handleSubmit,
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
