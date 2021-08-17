import { cloneElement, Children, useRef, createElement } from 'react'
import useFldX from './hooks/useFldX'
import { devEnvOnly, noProviderFor } from './utils/dx'

// TODO: Trim values when submitting based on prop && if type is text
export default function FldX({
  afterChange,
  autoCapitalizeOn,
  autoCompleteOff,
  autoCorrectOn,
  children,
  disabled: locallyDisabled,
  field,
  getValueFromArgs,
  // TODO: Rename to errorProp in V4
  isErrorProp,
  onChangeProp = "onChange",
  spellCheckOn,
  trim,
  type = "text",
  valueProp = "value",
  ...rest
}) {

  const fldx = useFldX(field, { afterChange, trim, disabled: locallyDisabled, native: true })

  if (!fldx) {
    noProviderFor('the <FldX/> component')
    if (children) return children
    else return null
  }

  const {
    value,
    setValue,
    error,
    disabled,
    onBlur
  } = fldx

  const onChange = useRef((...args) => {
    let val = !!getValueFromArgs ? getValueFromArgs(args) : type === "checkbox" ? args[0].target.checked : args[0].target.value
    setValue(val)
  })

  const props = {
    type,
    onBlur,
    onChange: onChange.current,
    disabled,
    [type === "checkbox" ? "checked" : "value"]: value,
    ...(isErrorProp ? { [isErrorProp]: error } : {}),
    ...(!autoCorrectOn && { autoCorrect: "off" }),
    ...(!autoCapitalizeOn && { autoCapitalize: "none" }),
    ...(!spellCheckOn && { spellCheck: "false" }),
    ...(autoCompleteOff && { autoComplete: "off" }),
    ...rest
  }

  return Children.only(children) && Children.map(children, child => cloneElement(child, props))
}
