---
id: fldx
title: FldX Component
sidebar_position: 2
---

# FldX Component

A glance at all the props FldX consumes:

```jsx
<FldX
// A boolean to disable autocapitalize
autoCapitalizeOff
// A boolean to disable autocorrect
autoCorrectOff
// You can target nested fields like so
field="a.nested.field"
// Pass a custom function to get back the value from the onChange args
// Useful for instance when interacting with material ui components
// As they often pass the new value through the second argument
// Example: <FldX ... getValueFromArgs={args => args[1].value}>...</FldX>
getValueFromArgs
// The name of the prop used by the underlying component
// to trigger an error state. Defaults to "error"
isErrorProp
// The name of the prop used to update the component with its value
// Defaults to "onChange"
onChangeProp
// The name of the component that holds the field's value
// Defaults to "value"
valueProp
// A boolean that indicates wether or not this is required
// Before submitting the form
required
// The type of your input, defaults to "text"
type="text"
// Pass this prop if you want the input to be trimmed
trim
// Any other props will be spread on to the underlying field
// A function to check the input is valid
validate={(value) => typeof value === "string"}
{...rest}
/>
```

## Notes

### Pathname notation

Use only "." notation, even for array elements, otherwise you will run into bugs. For instance, to access the string "baz" in {a: ["bar", {b: "baz"}]}}, you would give the field "a.1.b".

### Child(ren)

<FldX/> can have only one child element, which can have some other elements nested into it, of course.
