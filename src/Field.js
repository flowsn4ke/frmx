import { cloneElement, Children, useRef } from 'react'
import { useForm } from './Contexts'
import useField from './hooks/useField'
import { devEnvOnlyWarn, noProviderFor } from './utils/dx'

// TODO: Trim values when submitting based on prop && if type is text
export default function FldX({
  afterChange,
  autoCapitalizeOn,
  autoCompleteOff,
  autoCorrectOn,
  children: ChildComponent,
  disabled: locallyDisabled,
  path,
  getValueFromArgs,
  id,
  name,
  // TODO: Rename to errorProp / errorPropName in V4
  isErrorProp,
  onChangeProp = "onChange",
  spellCheckOn,
  trim,
  type = "text",
  valueProp = "value",
  ...rest
}) {

  const fldx = useField(path, { afterChange, trim, disabled: locallyDisabled, native: true })

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

  const { formId } = useForm()

  const onChange = useRef((...args) => {
    let val = !!getValueFromArgs ? getValueFromArgs(args) : type === "checkbox" ? args[0].target.checked : args[0].target.value
    setValue(val)
  })

  const props = {
    type,
    onBlur,
    onChange: onChange.current,
    // onKeyPress: e => e.key === 'Enter' && type === 'text' && handleSubmit(e),
    disabled,
    [type === "checkbox" ? "checked" : "value"]: value,
    id: !!id ? id : `${formId}-${path}`,
    name: !!name ? name : `${path} ${type}`,
    ...(isErrorProp ? { [isErrorProp]: error } : {}),
    ...(!autoCorrectOn && { autoCorrect: "off" }),
    ...(!autoCapitalizeOn && { autoCapitalize: "none" }),
    ...(!spellCheckOn && { spellCheck: "false" }),
    ...(autoCompleteOff && { autoComplete: "off" }),
    ...rest
  }

  try {
    return Children.only(ChildComponent) && cloneElement(ChildComponent, props)
  } catch (err) {
    devEnvOnlyWarn(`The FldX component can have only one child component. Check out the field ${path} to fix the problem, otherwise this field won't work.`)
    return ChildComponent
  }
}
