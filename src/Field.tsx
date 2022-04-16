import React from 'react'
import useField from './hooks/useField'
import { warnDev, noProviderFor } from './utils/dx'

interface FieldPropsInterface {
  afterChange?(value?: any, path?: string, error?: boolean): any,
  autoCapitalizeOn?: boolean,
  autoCompleteOff?: boolean,
  autoCorrectOn?: boolean,
  children: React.ReactElement,
  disabled?: boolean,
  path: string,
  getValueFromArgs?(args: any): any,
  isErrorProp?: string,
  onChangeProp?: string,
  spellCheckOn?: boolean,
  trim?: boolean,
  type?: string,
  valueProp?: string,
  rest?: any
}

export default function Field({
  afterChange,
  autoCapitalizeOn,
  autoCompleteOff,
  autoCorrectOn,
  children,
  disabled: locallyDisabled,
  path,
  getValueFromArgs,
  isErrorProp,
  onChangeProp = "onChange",
  spellCheckOn,
  trim,
  type = "text",
  valueProp = "value",
  ...rest
}: FieldPropsInterface) {
  const fldx = useField(path, { afterChange, trim, disabled: locallyDisabled, native: true })

  if (!fldx) {
    noProviderFor('the <FldX/> component')
    if (children) return children
    else return null
  }

  const { value, setValue, error, disabled, onBlur } = fldx

  const nativeType = children.type === "input" ? children.props?.type : undefined
  nativeType && (type = nativeType)

  const onChange = React.useRef((...args: any) => {
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

  try {
    if (React.isValidElement(children) && React.Children.only(children)) {
      return React.cloneElement(children as React.ReactElement, props); // on type guards: https://stackoverflow.com/questions/42261783/how-to-assign-the-correct-typing-to-react-cloneelement-when-giving-properties-to
    }

    else
      throw new Error();

  } catch (err) {
    warnDev(`The Field component can have only one child component. Check out the field ${path} to fix the problem, otherwise this field won't work.`);
    return children;
  }
}
