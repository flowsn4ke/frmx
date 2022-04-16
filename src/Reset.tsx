import React from 'react'
import { useForm } from './Contexts'
import { warnDev } from './utils/dx'

interface ResetInterface {
  children: React.ReactElement,
  onClick?(): any,
  rest?: any
}

export default function Reset({
  children,
  onClick,
  ...rest
}: ResetInterface) {
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
    if (React.isValidElement(children) && React.Children.only(children)) {
      return React.cloneElement(children as React.ReactElement, props);
    }

    else
      throw new Error();

  } catch (err) {
    warnDev(`The FldX component can have only one child component, otherwise resetting won't work.`);
    return children;
  }
}
