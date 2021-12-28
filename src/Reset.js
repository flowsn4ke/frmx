import { cloneElement, Children } from 'react'
import { useForm } from './Contexts'
import { warnDev } from './utils/dx'

export default function Reset({
  children,
  onClick,
  ...rest
}) {
  const {
    disabled,
    resetForm,
  } = useForm()

  const props = {
    type: "button",
    ...(disabled ? { disabled } : {}),
    onClick: () => [resetForm(), onClick && onClick()],
    ...rest
  }

  try {
    return Children.only(children) && cloneElement(children, props)
  } catch (err) {
    warnDev(`The FldX component can have only one child component, otherwise resetting won't work.`)
    return children
  }
}
