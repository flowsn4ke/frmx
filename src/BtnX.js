import React, { cloneElement, Children, Fragment } from "react"
import { useFrmX } from "./FrmXContext"

export default function BtnX({
  disabled: disabledPlus,
  children,
  ...rest
}) {
  const { isSubmitting, isValidForm, disableSubmitIfInvalid, updates, disableIfNoUpdates } = useFrmX()

  const props = {
    disabled: (!isValidForm && disableSubmitIfInvalid) || (disableIfNoUpdates && !Object.keys(updates).length) || isSubmitting || disabledPlus,
    type: "submit",
    ...rest
  }

  return <Fragment>
    {Children.only(children) && Children.map(children, child => {
      return cloneElement(child, props)
    })}
  </Fragment>
};
