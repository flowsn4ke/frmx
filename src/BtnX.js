import { cloneElement, Children, useEffect, useState, useRef } from 'react'

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
    hasUpdates,
    renderDiv,
    handleSubmit,
    xFields,
  } = useFrmX()

  const [errors, setErrors] = useState(0)

  useEffect(() => {
    on(`form-${formId}-total-errors`, total => {
      setErrors(prev => total !== prev ? total.detail : prev)
    })
  })

  const disabled = !!(isSubmitting ||
    (errors > 0 && disableSubmitIfInvalid) ||
    // (disableIfNoUpdates && !hasUpdates()) ||
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
