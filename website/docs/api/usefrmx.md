---
id: usefrmx
title: useFrmX Hook
sidebar_position: 6
---

# useFrmX Hook

The `useFrmX` hook must be consumed inside a `<FrmX/>` provider, as it uses its context.


## useFrmX values

In some rare cases, you might not be able to use FldX because of some input wrapper for instance (which happens with some Material UI fields).

In those cases you can use the `useFrmX` hook to manually update and get back the values for this specific field.

To do so, you can destructure all values frmx interacts with like so (assuming you're inside a `<FrmX></FrmX>` provider):

| Name                    | Type           |    Description |
|----------               | -------------  |  ------------- |
| getOneError | function | function that returns if the field has an error. Ex: `const isError = getOneError(field)` |
| getOneField | function | function that returns a field value. Ex: `const value = getOneField(field)` |
| getOneVisited | function | function returning a boolean, Ex: `const isVisited = getOneVisited(field)` |
| handleSubmit | function | the function implementing all frmx submitting logic |
| hasUpdates | boolean | boolean keeping track of wether or not the form was updated |
| isSubmitting | boolean | boolean keeping track of wether the form is submitting or not |
| isValidForm | boolean | boolean keeping track of wether the form is valid or not |
| resetForm | function | the function that resets the form to the initialValues state |
| setOneError | function | function accepting a boolean. Ex: `setOneError(field, true)` |
| setOneField | function | function that allows you to set a field value. Ex: `setOneField(field, value)` |
| setOneVisited | function | function to mark a field as visited. Ex: `setOneVisited(field)` |

**Note**: You can also test wether or not you're inside a `<FrmX></FrmX>` provider by not destructuring values right away, like so:

```js
const frmx = useFrmX()

if (!!frmx) {
  // ...do stuff here
  const { getOneError } = frmx
  frmx.handleSubmit()
}
```

## Example Usage

```jsx
const {
  getOneError,
  getOneField,
  getOneVisited,
  handleSubmit,
  hasUpdates,
  isSubmitting,
  isValidForm,
  resetForm,
  setOneError,
  setOneField,
  setOneVisited,
} = useFrmX()
```

## Example Usage

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
