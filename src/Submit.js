import { cloneElement, Children } from 'react'
import { useForm } from './Contexts'
import { devEnvOnlyWarn } from './utils/dx'

export default function Submit({
  disabled: locallyDisabled,
  children,
  ...rest
}) {
  const {
    disabled: formIsDisabled,
    render,
    handleSubmit,
  } = useForm()

  const disabled = locallyDisabled || formIsDisabled

  const props = {
    ...(disabled ? { disabled } : {}),
    ...(render === "div" ? { onClick: handleSubmit, type: "button" } : { type: "submit" }),
    ...rest
  }

  try {
    return Children.only(children) && cloneElement(children, props)
  } catch (err) {
    devEnvOnlyWarn(`The FldX component can have only one child component. Check out the field ${path} to fix the problem, otherwise this field won't work.`)
    return children
  }
}
