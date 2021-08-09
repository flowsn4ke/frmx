---
id: usefrmx
title: useFrmX Hook
sidebar_position: 6
---

# useFrmX Hook

The `useFrmX` hook must be consumed inside a `<FrmX/>` provider, as it uses its context.

You can destructure all values frmx interacts with, like so:

```jsx
const {
  // function that returns if the field has an error  => ex: getOneError(field)
  getOneError,
  // function that returns a field value => ex: const value = getOneField(field)
  getOneField,
  // function returning a boolean => ex: getOneVisited(field)
  getOneVisited,
  // The function implementing all frmx submitting logic
  handleSubmit,
  // boolean keeping track of wether or not the form was updated
  hasUpdates,
  // a boolean value
  isSubmitting,
  // yet another boolean value
  isValidForm,
  // the function that resets the form to the initialValues state
  resetForm,
  // function that accepts a boolean  => ex: setOneError(field, true)
  setOneError,
  // function that allows you to set a field value=> ex: setOneField(field, value)
  setOneField,
  // function to mark a field as visited  => ex: setOneVisited(field)
  setOneVisited,
} = useFrmX()
```

## Example Usage

In some rare cases, you might not be able to use FldX because of some input wrapper for instance (which happens with some Material UI fields).

In those cases you can use the `useFrmX` hook to manually update and get back the values for this specific field:

```jsx
import { FrmX, FldX, BtnX, useFrmX } from "frmx"
import { TextField, Button } from "@material-ui/core"
import { WeirdInput } from "some-random-pkg"

function CustomCheckboX({field}) {
  const {
    getOneField,
    setOneField,
    getOneVisited,
    setOneVisited,
    getOneError,
    setOneError,
    getIsSubmitting
  } = useFrmX()

  return <>
    <WeirdInput
      iChangeLikeThat={( a, b, c ) => {
        doSomethingWith(a)
        doSomethingWith(b)
        doSomethingWith(c)
        setOneField(field, [ a, b, c])
      }}
      myValue={getOneField(field)}
      onBluuuurr={() => setOneVisited(field)}
    >
  </>
}

export default function MyComponent() {
  return <>
  <FrmX
      initialValues={{ foo: "", bar: { baz: false } }}
      onSubmit={formData => alert(JSON.stringify(formData, null, 2))}
      >

          <FldX field="foo">
              <TextField>
          </FldX>

          <CustomCheckboX field="bar.baz">

          </FldX>

          <BtnX>
              <Button>Submit</Button>
          </BtnX>
      </FrmX>
  </>
}
```

**The good news is, once you've created a wrapper around this input, you can reuse it everywhere in your application, and it needs only one prop to operate, the field it should control, that is.**

## Performance considerations

In order to avoid wasteful rerenders, it is advised you wrap up the return statement in a `useMemo`, adding the field value to the dependency array. `<FrmX/>` automatically handles that for components using the `<FldX/>` component.

For instance, rewriting the previous example:

```jsx
import { FrmX, FldX, BtnX, useFrmX } from "frmx"
import { TextField, Button } from "@material-ui/core"
import { WeirdInput } from "some-random-pkg"

function CustomCheckboX({field}) {
  const {
    getOneField,
    setOneField,
    setOneVisited,
  } = useFrmX()

  const value = useMemo(() => getOneField(field), [getOneField, field])

  return useMemo(() => {
    return <>
    <WeirdInput
      iChangeLikeThat={( a, b, c ) => {
        doSomethingWith(a)
        doSomethingWith(b)
        doSomethingWith(c)
        setOneField(field, [ a, b, c])
      }}
      myValue={getOneField(field)}
      onBluuuurr={() => setOneVisited(field)}
    >
  </>
  }, [value])
}
```

You can check out the `<FldX/>` implementation for more inspiration.
