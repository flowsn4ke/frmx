import {
  createElement,
  useEffect,
  useRef,
  ReactElement,
  ChangeEvent
} from 'react'
import { nanoid } from 'nanoid'

import { FormContext } from './Contexts'
import { trigger } from 'react-events-utils'
import { resetEvent, setEvent, submitEvent } from './events'
import Proxify from "proxur"
import clone from './utils/clone'

interface FormPropsInterface {
  afterChange?(fields: object, path: string, hasErrors: boolean, getErrors: any): any,
  autoCompleteOff?: boolean,
  children: ReactElement,
  clearAfterSubmit?: any,
  disabled?: boolean,
  disableIf?(fields: object): boolean,
  disableIfNoUpdates?: boolean,
  disableIfInvalid?: boolean,
  initialValues: object,
  noRefresh?: boolean,
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
  noRefresh,
  onInvalidSubmit,
  onReset,
  onSubmit,
  schemaValidation = {},
  render = "div", // TODO: Check render is a legal value, otherwise replace it with "div"
  ...rest
}: FormPropsInterface) {
  const fields = useRef(Proxify(clone(initialValues)))
  const validation = useRef(Proxify(schemaValidation))
  const observers = useRef(new Set())
  const updated = useRef(new Set())
  const errors = useRef(new Set())
  const isSubmitting = useRef(false)
  const formId = useRef(nanoid())

  useEffect(() => {
    if (!noRefresh) {
      fields.current = Proxify(clone(initialValues))
      validation.current = Proxify(clone(schemaValidation))
    }
  }, [initialValues, schemaValidation])

  const hasUpdates = () => updated.current.size > 0
  const hasErrors = () => errors.current.size > 0

  const getFields = () => fields.current
  const getErrors = () => new Set(errors.current)

  const getOneField = (path: string) => fields.current[path]
  const setOneField = (path: string, value: any) => {
    fields.current[path] = value
    setOneUpdated(path)
    observers.current.has(path) && trigger(setEvent(formId.current, path), value)
    !!afterChange && afterChange(fields.current, path, hasErrors(), getErrors())
  }

  const getOneUpdated = (path: string) => updated.current.has(path)
  const setOneUpdated = (path: string) => {
    if (!updated.current.has(path))
      updated.current.add(path)
  }

  const getOneError = (path: string) => errors.current.has(path)
  const setOneError = (path: string, isError) => {
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
  }

  const handleSubmit = (e?: ChangeEvent) => {
    e?.preventDefault()
    if (isSubmitting.current === true) return

    if ((disableIfNoUpdates) && !hasUpdates()) {
      trigger(submitEvent(formId.current))
      return
    } else if (
      ((disableIfInvalid || onInvalidSubmit) && hasErrors()) ||
      (!!disableIf && disableIf(clone(Object.getPrototypeOf(fields.current))))
    ) {
      trigger(submitEvent(formId.current))

      if (!!onInvalidSubmit)
        onInvalidSubmit()

    } else {
      isSubmitting.current = true
      updated.current = new Set()
      errors.current = new Set()
      onSubmit(clone(Object.getPrototypeOf(fields.current)))
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
