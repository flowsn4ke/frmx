---
id: fldx
title: FldX Component
sidebar_position: 2
---

# FldX Component

## FldX Props

| Name                    | Type           | Default       |  Description |
|----------               | -------------  | ------------- |  ------------- |
| afterChange             | function       | undefined     |  Middleware that will be called with the field name and its new value after each change: `afterChange(field, newValue)` |
| autoCapitalizeOn | boolean | false | Enables autocapitalize |
| autoCompleteOff | boolean | false | Disables autocomplete for this input |
| autoCorrectOn | boolean | false | Enables autocorrect |
| disabled | boolean | undefined | Programmatically disable a field. Ex: `disabled={someCondition === true}` |
| field | string | undefined |  The field that should be controlled by frmx. You can target nested fields like so `"a.nested.field"` (lodash notation). |
| getValueFromArgs | function | `(args) => args[0].target.value` | Pass a custom function to get back the value from the onChange args. Useful for instance when interacting with material ui components as they often pass the `newValue` through the second argument. Example: `<FldX ... getValueFromArgs={args => args[1]}>...</FldX>` |
| isErrorProp | string | undefined | The name of the prop used by the underlying component to trigger an error state based on a boolean. |
| onChangeProp | string | "onChange" | The name of the prop used to update the component with its value. |
| trim | boolean | false | Pass this prop if you want the input to be trimmed (if it's a `string`). The user won't be able to type whitespaces at the beginning or the end of the input field. |
| type | string | "text" | The type of your input. Note: Pass "checkbox" for checkboxes AND switches. |
| valueProp | string | "value" | The name of the component that holds the field's value. |
| ...rest                 | any            | undefined     |  Any other props will be spread on to the `<form>` / `<div>` tag |

## Example Usage

```jsx
<FldX
autoCapitalizeOff
autoCorrectOff
field="a.nested.field"
getValueFromArgs
isErrorProp
onChangeProp
valueProp
required
type="text"
trim
{...rest}
/>
```

## Notes

### Pathname notation

Use only "." notation, even for array elements, otherwise you might run into bugs. For instance, to access the string "baz" in {a: ["bar", {b: "baz"}]}}, you would give the field "a.0.b".

### Child(~~ren~~)

`<FldX/>` can have only one child element.
