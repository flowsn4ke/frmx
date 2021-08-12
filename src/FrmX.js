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
  const xOriginal = useRef(cloneDeep(initialValues))
  const xFields = useRef(cloneDeep(initialValues))
  const xBlurred = useRef(new Set())
  const xErrors = useRef(new Set())
  const xIsSubmitting = useRef(false)
  const formId = useRef(nanoid())
  const diffAlg = useRef(getDiffAlg(diff || updatesOnly ? 'shallow' : ''))
  const touched = useRef(false)

  const hasUpdates = () => xBlurred.current.size > 0 || touched.current
  const hasErrors = () => xErrors.current.size > 0

  // Functions intended to be used with the useFrmX hook in fields
  const getOneField = (field) => get(xFields.current, field)
  const setOneField = (field, value) => {
    set(xFields.current, field, value)
    if (!hasUpdates()) {
      trigger(`form-${formId.current}-first-update`)
      touched.current = true
    }
    if (!!afterChange) afterChange(xFields.current)
  }

  const getOneVisited = (field) => xBlurred.current.has(field)
  const setOneVisited = (field) => {
    if (!xBlurred.current.has(field)) xBlurred.current.add(field)
  }

  const getOneError = (field) => xErrors.current.has(field)
  const setOneError = (field, isError) => {
    if (isError && !xErrors.current.has(field)) {
      xErrors.current.add(field)
      trigger(`form-${formId.current}-total-errors`, xErrors.current.size)
    } else if (!isError && xErrors.current.has(field)) {
      xErrors.current.delete(field)
      trigger(`form-${formId.current}-total-errors`, xErrors.current.size)
    }
  }

  const resetForm = () => {
    if (onReset) onReset(diffAlg.current(xOriginal.current, xFields.current))
    xBlurred.current = new Set()
    xFields.current = cloneDeep(xOriginal.current)
    touched.current = false
    trigger(`form-${formId.current}-reset`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    xIsSubmitting.current = true
    if (
      ((updatesOnly || disableIfNoUpdates || !!diff) && !hasUpdates()) ||
      ((disableSubmitIfInvalid || onInvalidSubmit) && hasErrors()) ||
      (!!disabledIf && disabledIf(diffAlg.current(xOriginal.current, xFields.current)))
    ) {
      if (!!onInvalidSubmit) onInvalidSubmit()
    } else {
      xBlurred.current = new Set()
      xErrors.current = new Set()
      onSubmit(diffAlg.current(xOriginal.current, xFields.current))
      if (clearAfterSubmit) resetForm()
    }
    xIsSubmitting.current = false
  }

  return <FrmXContext.Provider value={{
    disabled,
    disabledIf,
    disableIfNoUpdates,
    disableSubmitIfInvalid,
    formId: formId.current,
    handleSubmit,
    hasErrors,
    hasUpdates,
    isSubmitting: xIsSubmitting.current,
    getOneField,
    getOneVisited,
    getOneError,
    renderDiv,
    resetForm,
    setOneError,
    setOneField,
    setOneVisited,
    schemaValidation,
    xErrors,
    xFields,
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
