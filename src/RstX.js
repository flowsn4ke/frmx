import React, { cloneElement, Children, Fragment } from "react"
import { useFrmX } from "./FrmXContext"

export default function RstX({
  children,
  ...rest
}) {
  const { resetForm, updates } = useFrmX()

  const props = {
    type: "button",
    disabled: !Object.keys(updates).length,
    onClick: resetForm,
    ...rest
  }

  return <Fragment>
    {Children.only(children) && Children.map(children, child => {
      return cloneElement(child, props)
    })}
  </Fragment>
};
