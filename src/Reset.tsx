import {
  cloneElement,
  Children,
  ReactElement,
  isValidElement
} from 'react'
import { useForm } from './Contexts'
import { warnDev } from './utils/dx'

interface ResetInterface {
  children: ReactElement,
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
    if (isValidElement(children) && Children.only(children))
      return cloneElement(children as ReactElement, props)

    else
      throw new Error()

  } catch (err) {
    warnDev(`The FldX component can have only one child component, otherwise resetting won't work.`)
    return children
  }
}
