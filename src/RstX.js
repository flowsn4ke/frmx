import React, { cloneElement, Children, Fragment } from "react"
import { useFrmX } from "./FrmXContext"

export default function RstX({
  children,
  ...rest
}) {
  const { resetForm, hasUpdates } = useFrmX()

  const props = {
    type: "button",
    disabled: !hasUpdates,
    onClick: resetForm,
    ...rest
  }

  return <Fragment>
    {Children.only(children) && Children.map(children, child => {
      return cloneElement(child, props)
    })}
  </Fragment>
};
