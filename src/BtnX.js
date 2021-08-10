import { cloneElement, Children } from 'react'

import { useFrmX } from './Contexts'

export default function BtnX({
  disabled: localyDisabled,
  children,
  ...rest
}) {
  const {
    disabled: formIsDisabled,
    disableIfNoUpdates,
    disableSubmitIfInvalid,
    isSubmitting,
    isValidForm,
    hasUpdates,
    isConditionnallyDisabled,
    renderDiv,
    handleSubmit
  } = useFrmX()

  const disabled = !!(isSubmitting ||
    (!isValidForm && disableSubmitIfInvalid) ||
    (disableIfNoUpdates && !hasUpdates) ||
    isConditionnallyDisabled ||
    localyDisabled || formIsDisabled)

  const props = {
    disabled,
    ...(renderDiv ? { onClick: handleSubmit, type: "button" } : { type: "submit" }),
    ...rest
  }

  return Children.only(children) && Children.map(children, child => cloneElement(child, props))
}
