import { cloneElement, Children, useState, useEffect } from 'react'

import { useFrmX } from './Contexts'
import { off, on } from './utils/events'

export default function RstX({
  children,
  ...rest
}) {
  const {
    disabled,
    formId,
    isSubmitting,
    resetForm,
  } = useFrmX()

  const [touched, setTouched] = useState(false)

  const handleTouched = _e => setTouched(true)
  const handleUntouched = _e => setTouched(false)

  useEffect(() => {
    on(`form-${formId}-first-update`, handleTouched)
    on(`form-${formId}-reset`, handleUntouched)

    return () => {
      off(`form-${formId}-first-update`, handleTouched)
      off(`form-${formId}-reset`, handleUntouched)
    }
  })

  const props = {
    type: "button",
    disabled: !touched || disabled || isSubmitting,
    onClick: resetForm,
    ...rest
  }

  return Children.only(children) && Children.map(children, child => cloneElement(child, props))
}
