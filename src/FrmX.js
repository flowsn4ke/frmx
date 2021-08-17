import React, { useRef } from 'react'
import get from 'lodash-es/get'
import set from 'lodash-es/set'
import cloneDeep from 'lodash-es/cloneDeep'
import { nanoid } from 'nanoid'

import { FrmXContext } from './Contexts'
import { shallowDiff, diffOnUpdatedKeys, deepDiff } from './utils/diff'
import { trigger } from './utils/events'
import useDocumentListener from './hooks/useDocumentListener'

const getDiffAlg = (key) => {
  switch (key) {
    case 'shallow': {
      return shallowDiff
    }
    case 'keys': {
      return diffOnUpdatedKeys
    }
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
  clearAfterSubmit,
  diff,
  disabled,
  // TODO: Rename to validIf in v4
  disabledIf,
  disableIfNoUpdates,
  // TODO: Rename to disableIfInvalid in v4
  disableSubmitIfInvalid,
  initialValues = {},
  onInvalidSubmit,
  onReset,
  onSubmit,
  renderDiv,
  schemaValidation = {},
  updatesOnly,
  ...rest
}) {
  const original = useRef(cloneDeep(initialValues))
  const fields = useRef(cloneDeep(initialValues))
  const updated = useRef(new Set())
  const errors = useRef(new Set())
  const isSubmitting = useRef(false)
  const formId = useRef(nanoid())
  const diffAlg = useRef(getDiffAlg(!!diff ? diff : updatesOnly ? 'shallow' : ''))

  const hasUpdates = () => updated.current.size > 0
  const hasErrors = () => errors.current.size > 0

  const getOneField = (field) => get(fields.current, field)
  const setOneField = (field, value) => {
    set(fields.current, field, value)
    setOneVisited(field)
    if (!!afterChange) afterChange(fields.current)
  }

  // TODO: Deprecate [set/get]OneVisited in v4
  const getOneVisited = (field) => updated.current.has(field)
  const setOneVisited = (field) => {
    if (!updated.current.has(field)) updated.current.add(field)
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

  const useResetListener = (handleReset) => useDocumentListener(`form-${formId.current}-reset`, handleReset)

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
    fields: fields.current,
    formId: formId.current,
    handleSubmit,
    getOneField,
    getOneVisited,
    getOneUpdated,
    setOneUpdated,
    getOneError,
    renderDiv,
    resetForm,
    setOneError,
    setOneField,
    setOneVisited,
    schemaValidation,
    useResetListener,
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
  </FrmXContext.Provider>
}
