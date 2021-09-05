---
id: usefldx
title: useField Hook
sidebar_position: 7
---

The `useField` hook must be consumed inside a `<Form/>` provider, as it uses its context. It allows you to handle more complex situations while still managing state for you. The initial value will be the one you provided in the `initialValues` object passed to `<Form/>` and data validation will still be handled by frmx.

The same hook is used by `<Field/>` internally, ensuring coherency accross all your inputs.

If you feel like it's still not flexible enough, you can [check out the `useForm` hook](https://www.frmx.io/docs/api/usefrmx).

**Note**: The error returned is a *state of the UI*. Validation still happens internally following the rules you set in hte schemaValidation object you passed to `<Form/>`. For it to work correctly, you need to use onBlur. If you can't pass an "onBlur" prop to your input, just call it right after you first set the value.

## Example Usage

```jsx
import { Form, Field, Submit, useField } from "frmx"
import { TextField, Button } from "@material-ui/core"
import { WeirdInput } from "some-random-pkg"

function CustomCheckboX({field}) {
  const {
    value,
    setValue,
    error,
    onBlur,
    disabled
  } = useField(field)

  return <>
    <WeirdInput
      iChangeLikeThat={( a, b, c ) => {
        setValue([ a, b, c])
      }}
      onBlurr={onBlur}
      disabled={disabled}
      error={error}
      myValue={value}
    >
  </>
}

export default function MyComponent() {
  return <>
  <Form
      initialValues={{ foo: "", bar: { baz: false } }}
      onSubmit={formData => alert(JSON.stringify(formData, null, 2))}
      >

          <Field field="foo">
              <TextField>
          </Field>

          <CustomCheckboX field="bar.baz">

          </Field>

          <Submit>
              <Button>Submit</Button>
          </Submit>
      </Form>
  </>
}
```

**The good news is, once you've created a wrapper around this input, you can reuse it everywhere in your application, and it needs only one prop to operate (the field it should control, that is). It will be automagically linked to the nearest frmx parent through React's Context API.**

## Configuration Object

You can also pass a configuration object as a second argument to `useField`, like so:

```jsx
const config = {
  afterChange: (newValue, fieldName) => console.log(newValue, fieldName),
  trim: true,
  disabled: condition1 && condition2
}

const {
  value,
  setValue,
  error,
  disabled,
  onBlur
} = useField(field, config)
```

## Full API reference

You can destructure the following values from `useField(field)`:

| Name                    | Type           |    Description |
|----------               | -------------  |  ------------- |
| value | any | Value corresponding to the one you passed in initialValues for that field or the latest value you set with setValue. |
| setValue | function | Use this function to update the value. Works the exact same way React's setter function works with useState. |
| error | boolean | Boolean corresponding to the one you set with setError. Starts at false. If you wish to check the value on mount, you can do so using useEffect with an empty array dependency: `useEffect(() => { if(someCondition) setError(booleanValue) })`. |
| setError | function | Use this function to update the error value. Works the exact same way React's setter function works with useState. |
| disabled | function |  Returns a boolean indicating wether or not the form was programmatically disabled in the `<Form/>` provider. |

