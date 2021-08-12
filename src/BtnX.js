import { cloneElement, Children, useEffect, useState } from 'react'

import { useFrmX } from './Contexts'
import { on } from './utils/events'

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

  useEffect(() => {
    on(`form-${formId}-total-errors`, total => setErrors(prev => total !== prev ? total.detail : prev))
    on(`form-${formId}-first-update`, _e => setTouched(true))
    on(`form-${formId}-reset`, _e => setTouched(false))
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
