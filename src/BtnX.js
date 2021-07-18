import React, { cloneElement, Children, Fragment } from "react"
import { useFrmX } from "./FrmXContext"

export default function BtnX({
  disabled: disabledPlus,
  children,
  ...rest
}) {
  const { isSubmitting } = useFrmX()

  const props = {
    disabled: disabledPlus || isSubmitting,
    type: "submit",
    ...rest
  }

  return <Fragment>
    {Children.only(children) && Children.map(children, child => {
      return cloneElement(child, props)
    })}
  </Fragment>
};
