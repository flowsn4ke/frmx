import { cloneElement, Children } from 'react'

import { useFrmX } from './Contexts'
import useDocumentListener from './hooks/useDocumentListener'

export default function RstX({
  children,
  ...rest
}) {
  const {
    disabled,
    formId,
    resetForm,
  } = useFrmX()

  const handleUntouched = _e => setTouched(false)
  useDocumentListener(`form-${formId}-reset`, handleUntouched)

  const props = {
    type: "button",
    ...(disabled ? { disabled } : {}),
    onClick: resetForm,
    ...rest
  }

  return Children.only(children) && Children.map(children, child => cloneElement(child, props))
}
