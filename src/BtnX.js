import { cloneElement, Children } from 'react'
import { useFrmX } from './Contexts'

export default function BtnX({
  disabled: locallyDisabled,
  children,
  ...rest
}) {
  const {
    disabled: formIsDisabled,
    renderDiv,
    handleSubmit,
  } = useFrmX()

  const disabled = locallyDisabled || formIsDisabled

  const props = {
    ...(disabled ? { disabled } : {}),
    ...(renderDiv ? { onClick: handleSubmit, type: "button" } : { type: "submit" }),
    ...rest
  }

  return Children.only(children) && Children.map(children, child => cloneElement(child, props))
}
