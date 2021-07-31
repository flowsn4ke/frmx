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
    updates,
    disableIfNoUpdates,
    isConditionnallyDisabled,
    renderDiv,
    handleSubmit
  } = useFrmX()

  const props = {
    disabled: (!isValidForm && disableSubmitIfInvalid) ||
      (disableIfNoUpdates && !Object.keys(updates).length) ||
      isConditionnallyDisabled ||
      localyDisabled ||
      isSubmitting,
    ...(renderDiv ? {
      onClick: handleSubmit,
      type: "button"
    } : {
      type: "submit"
    }),
    ...rest
  }

  return <Fragment>
    {Children.only(children) && Children.map(children, child => {
      return cloneElement(child, props)
    })}
  </Fragment>
};
