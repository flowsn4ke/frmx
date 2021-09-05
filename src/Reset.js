import { cloneElement, Children } from 'react'
import { useForm } from './Contexts'
import { devEnvOnlyWarn } from './utils/dx'

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

  try {
    return Children.only(children) && cloneElement(children, props)
  } catch (err) {
    devEnvOnlyWarn(`The FldX component can have only one child component. Check out the field ${path} to fix the problem, otherwise this field won't work.`)
    return children
  }
}
