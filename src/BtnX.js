import { cloneElement, Children, useMemo } from 'react'

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

  const disabled = useMemo(() => !!(isSubmitting ||
    (!isValidForm && disableSubmitIfInvalid) ||
    (disableIfNoUpdates && !hasUpdates) ||
    isConditionnallyDisabled ||
    localyDisabled || formIsDisabled),
    [
      disableIfNoUpdates,
      disableSubmitIfInvalid,
      formIsDisabled,
      hasUpdates,
      isConditionnallyDisabled,
      isSubmitting,
      isValidForm,
      localyDisabled,
    ])

  const props = {
    disabled,
    ...(renderDiv ? { onClick: handleSubmit, type: "button" } : { type: "submit" }),
    ...rest
  }

  return useMemo(() => Children.only(children) && Children.map(children, child => cloneElement(child, props)), [disabled])
}
