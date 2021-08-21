import { cloneElement, Children } from 'react'

import { useFrmX } from './Contexts'

export default function RstX({
  children,
  onClick,
  ...rest
}) {
  const {
    disabled,
    resetForm,
  } = useFrmX()

  const props = {
    type: "button",
    ...(disabled ? { disabled } : {}),
    onClick: () => [resetForm(), onClick()],
    ...rest
  }

  return Children.only(children) && Children.map(children, child => cloneElement(child, props))
}
