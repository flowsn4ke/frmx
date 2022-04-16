import React from 'react'
import { useForm } from './Contexts'
import { warnDev } from './utils/dx'

interface SubmitInterface {
  children: React.ReactElement,
  disabled?(): boolean,
  rest?: any
}

export default function Submit({
  disabled: locallyDisabled,
  children,
  ...rest
}: SubmitInterface) {
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
    if (React.isValidElement(children) && React.Children.only(children)) {
      return React.cloneElement(children as React.ReactElement, props);
    }

    else
      throw new Error();

  } catch (err) {
    warnDev(`The FldX component can have only one child component, otherwise submitting won't work.`);
    return children;
  }
}
