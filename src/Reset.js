import { cloneElement, Children } from 'react'
import { useForm } from './Contexts'

export default function RstX({
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

  return Children.only(children) && cloneElement(children, props)
}
