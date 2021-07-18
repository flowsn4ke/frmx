import React, { cloneElement, Children, Fragment } from "react"
import { useFrmX } from "./FrmXContext"

export default function BtnX({
  disabled: disabledPlus,
  children,
  ...rest
}) {
  const { isSubmitting, isValidForm } = useFrmX()

  const props = {
    disabled: !isValidForm || isSubmitting || disabledPlus,
    type: "submit",
    ...rest
  }

  return <Fragment>
    {Children.only(children) && Children.map(children, child => {
      return cloneElement(child, props)
    })}
  </Fragment>
};
