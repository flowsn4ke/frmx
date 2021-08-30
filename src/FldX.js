import { cloneElement, Children, useRef } from 'react'
import { useFrmX } from './Contexts'
import useFldX from './hooks/useFldX'
import { noProviderFor } from './utils/dx'

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
  // TODO: additionnal error logic custom like disabled
  // TODO: Rename to errorProp / errorPropName in V4
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

  const { handleSubmit } = useFrmX()

  const onChange = useRef((...args) => {
    let val = !!getValueFromArgs ? getValueFromArgs(args) : type === "checkbox" ? args[0].target.checked : args[0].target.value
    setValue(val)
  })

  const props = {
    type,
    onBlur,
    onChange: onChange.current,
    onKeyPress: e => e.key === 'Enter' && handleSubmit(e),
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
