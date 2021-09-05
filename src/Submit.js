import { cloneElement, Children } from 'react'
import { useForm } from './Contexts'

export default function BtnX({
  disabled: locallyDisabled,
  children,
  ...rest
}) {
  const {
    disabled: formIsDisabled,
    renderDiv,
    handleSubmit,
  } = useForm()

  const disabled = locallyDisabled || formIsDisabled

  const props = {
    ...(disabled ? { disabled } : {}),
    ...(renderDiv ? { onClick: handleSubmit, type: "button" } : { type: "submit" }),
    ...rest
  }

  return Children.only(children) && cloneElement(children, props)
}
