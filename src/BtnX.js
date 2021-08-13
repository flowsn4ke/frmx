import { cloneElement, Children, useEffect, useState } from 'react'

import { useFrmX } from './Contexts'
import { off, on } from './utils/events'

export default function BtnX({
  disabled: localyDisabled,
  disabledIf,
  children,
  ...rest
}) {
  const {
    disabled: formIsDisabled,
    disableIfNoUpdates,
    disableSubmitIfInvalid,
    formId,
    isSubmitting,
    renderDiv,
    handleSubmit,
    xFields,
  } = useFrmX()

  const [errors, setErrors] = useState(0)
  const [touched, setTouched] = useState(false)

  const handleErrors = total => setErrors(prev => total !== prev ? total.detail : prev)
  const handleTouched = _e => setTouched(true)
  const handleUntouched = _e => setTouched(false)

  useEffect(() => {
    on(`form-${formId}-total-errors`, handleErrors)
    on(`form-${formId}-first-update`, handleTouched)
    on(`form-${formId}-reset`, handleUntouched)

    return () => {
      off(`form-${formId}-total-errors`, handleErrors)
      off(`form-${formId}-first-update`, handleTouched)
      off(`form-${formId}-reset`, handleUntouched)
    }
  })

  const disabled = !!(isSubmitting ||
    (errors > 0 && disableSubmitIfInvalid) ||
    (disableIfNoUpdates && !touched) ||
    !!formIsDisabled ||
    (!!disabledIf ? disabledIf(xFields.current) : false) ||
    localyDisabled
    || formIsDisabled)

  const props = {
    disabled,
    ...(renderDiv ? { onClick: handleSubmit, type: "button" } : { type: "submit" }),
    ...rest
  }

  return Children.only(children) && Children.map(children, child => cloneElement(child, props))
}
