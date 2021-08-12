import { cloneElement, Children, useState, useEffect } from 'react'

import { useFrmX } from './Contexts'
import { on } from './utils/events'

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

  useEffect(() => {
    on(`form-${formId}-first-update`, _e => setTouched(true))
    on(`form-${formId}-reset`, _e => setTouched(false))
  })

  const props = {
    type: "button",
    disabled: !touched || disabled || isSubmitting,
    onClick: resetForm,
    ...rest
  }

  return Children.only(children) && Children.map(children, child => cloneElement(child, props))
}
