import { cloneElement, Children } from 'react'
import { useForm } from './Contexts'
import { warnDev } from './utils/dx'

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
    warnDev(`The FldX component can have only one child component, otherwise submitting won't work.`)
    return children
  }
}
