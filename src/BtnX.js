import React, { cloneElement, Children, Fragment } from "react"
import { useFrmX } from "./FrmXContext"

export default function BtnX({
  disabled: localyDisabled,
  children,
  ...rest
}) {
  const {
    isSubmitting,
    isValidForm,
    disableSubmitIfInvalid,
    hasUpdates,
    disableIfNoUpdates,
    isConditionnallyDisabled,
    renderDiv,
    handleSubmit
  } = useFrmX()

  const disabled = isSubmitting ||
    (!isValidForm && disableSubmitIfInvalid) ||
    (disableIfNoUpdates && !hasUpdates) ||
    isConditionnallyDisabled ||
    localyDisabled

  const props = {
    disabled,
    ...(renderDiv ? { onClick: handleSubmit, type: "button" } : { type: "submit" }),
    ...rest
  }

  return <Fragment>
    {Children.only(children) && Children.map(children, child => {
      return cloneElement(child, props)
    })}
  </Fragment>
};
