import React from 'react'
import { FormContext } from './Contexts'
import Snowflake from './libs/snowflake-id'
import { trigger } from './libs/events-utils'
import { resetEvent, setEvent, submitEvent } from './events'
import Proxify from "proxur"
import clone from './utils/clone'

const s = new Snowflake()

interface FormPropsInterface {
  afterChange?(fields: object, path: string | null, hasErrors: boolean, getErrors: any): any,
  autoCompleteOff?: boolean,
  children: React.ReactElement,
  clearAfterSubmit?: any,
  disabled?: boolean,
  disableIf?(fields: object): boolean,
  disableIfNoUpdates?: boolean,
  disableIfInvalid?: boolean,
  initialValues: object,
  refresh?: boolean,
  onInvalidSubmit?(): any,
  onReset?(fields: object): any,
  onSubmit?(fields: object): any,
  schemaValidation?: object,
  render?: string,
  rest?: any
}

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
  refresh,
  onInvalidSubmit,
  onReset,
  onSubmit,
  schemaValidation = {},
  render = "div", // TODO: Check render is a legal value, otherwise replace it with "div"
  ...rest
}: FormPropsInterface) {
  const fields = React.useRef(Proxify(clone(initialValues)))
  const validation = React.useRef(Proxify(schemaValidation))
  const observers = React.useRef(new Set())
  const updated = React.useRef(new Set<string>())
  const errors = React.useRef(new Set())
  const isSubmitting = React.useRef(false)
  const formId = React.useRef(s.generate())

  React.useEffect(() => {
    if (refresh) {
      fields.current = Proxify(clone(initialValues))
      validation.current = Proxify(clone(schemaValidation))
    }
  }, [initialValues])

  const getUpdatesList = () => [...updated.current]
  const hasUpdates = () => updated.current.size > 0
  const hasErrors = () => errors.current.size > 0

  const getFields = () => Object.getPrototypeOf(fields.current)
  const getErrors = () => new Set(errors.current)

  const getOneField = (path: string) => fields.current[path]
  const setOneField = (path: string, value: any) => {
    try {
      fields.current[path] = value
      setOneUpdated(path)
      observers.current.has(path) && trigger(setEvent(formId.current, path), value)
      !!afterChange && afterChange(clone(Object.getPrototypeOf(fields.current)), path, hasErrors(), getErrors())
    } catch (err) {
      console.log(err)
    }
  }
  const unsetOneField = (path: string) => {
    delete fields.current[path]
    updated.current.delete(path)
    errors.current.delete(path)
    observers.current.delete(path)
  }

  const getOneUpdated = (path: string) => updated.current.has(path)
  const setOneUpdated = (path: string) => {
    if (!updated.current.has(path))
      updated.current.add(path)
  }

  const getOneError = (path: string) => errors.current.has(path)
  const setOneError = (path: string, isError: boolean) => {
    if (isError && !errors.current.has(path)) {
      errors.current.add(path)
    } else if (!isError && errors.current.has(path)) {
      errors.current.delete(path)
    }
  }

  const registerFieldObserver = (path: string) => !observers.current.has(path) && observers.current.add(path)

  const resetForm = () => {
    if (onReset && hasUpdates())
      onReset(fields.current)

    updated.current = new Set()
    fields.current = Proxify(clone(initialValues))
    trigger(resetEvent(formId.current))

    if (afterChange)
      afterChange(clone(Object.getPrototypeOf(fields.current)), null, hasErrors(), getErrors())
  }

  const handleSubmit = (e?: React.ChangeEvent) => {
    e?.preventDefault()
    trigger(submitEvent(formId.current))

    if (isSubmitting.current === true) return

    if ((disableIfNoUpdates) && !hasUpdates()) {
      return
    } else if (
      ((disableIfInvalid || onInvalidSubmit) && hasErrors()) ||
      (!!disableIf && disableIf(clone(Object.getPrototypeOf(fields.current))))
    ) {
      if (!!onInvalidSubmit)
        onInvalidSubmit()

    } else {
      isSubmitting.current = true
      onSubmit(clone(Object.getPrototypeOf(fields.current)), Array.from(updated.current))
      errors.current = new Set()
      updated.current = new Set()
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

  return <FormContext.Provider
    value={{
      disabled: !!disabled,
      formId: formId.current,
      handleSubmit,
      getErrors,
      getFields,
      getOneField,
      getOneUpdated,
      getOneError,
      getUpdatesList,
      hasUpdates,
      hasErrors,
      registerFieldObserver,
      render,
      resetForm,
      setOneError,
      setOneField,
      setOneUpdated,
      unsetOneField,
      schemaValidation: validation.current,
    }}>
    {React.createElement(render, props)}
  </FormContext.Provider>
}
