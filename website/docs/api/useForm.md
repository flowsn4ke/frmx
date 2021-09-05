---
id: usefrmx
title: useForm Hook
sidebar_position: 6
---

The `useForm` hook must be consumed inside a `<Form/>` provider, as it uses its context.

## Check out useField first

It's probable that you can get away using the `useField` hook, which provides state management out of the box. Please check it out before reaching for `useForm`!

## useForm

In some rare cases, you might not be able to use Field because of some input wrapper for instance (which happens with some Material UI fields). You can then use the `useForm` hook to manually update and get back the values for this specific field. This field should maintain its own state and update the values (and) held by frmx as a side effect, like so:

### Example Usage

```jsx
import React, { useState } from 'react'
import { Form, Field, Submit, useForm } from "frmx"
import { TextField, Button } from "@material-ui/core"
import { WeirdInput } from "some-random-pkg"

function CustomCheckboX({field}) {
  const {
    getOneField,
    setOneField,
  } = useForm()

  const [val, setVal] = useState(getOneField(field))

  return <>
    <WeirdInput
      iChangeLikeThat={( a, b, c ) => {
        setVal([ a, b, c])
        setOneField(field, [ a, b, c])
      }}
      myValue={val}
    >
  </>
}

export default function MyComponent() {
  return <>
  <Form
      initialValues={{ foo: "", bar: { baz: false } }}
      onSubmit={formData => alert(JSON.stringify(formData, null, 2))}
      >

          <Field path="foo">
              <TextField>
          </Field>

          <CustomCheckboX path="bar.baz">

          </Field>

          <Submit>
              <Button>Submit</Button>
          </Submit>
      </Form>
  </>
}
```

**The good news is, once you've created a wrapper around this input, you can reuse it everywhere in your application, and it needs only one prop to operate (the field it should control, that is). It will be automagically linked to the nearest frmx parent through React's Context API**

**Note**: It's also important your remember to do the exact same thing for the error state: Keep track of it locally and update it in frmx as a side effect if you need to validate that input

### Full API reference

To do so, you can destructure all values frmx interacts with like so (assuming you're inside a `<Form></Form>` provider):

| Name                    | Type           |    Description |
|----------               | -------------  |  ------------- |
| getFields | function | function that returns all the fields as currently edited. Ex: `const fields = getFields()` |
| getOneError | function | function that returns if the field has an error. Ex: `const isError = getOneError(field)` |
| getOneField | function | function that returns a field value. Ex: `const value = getOneField(field)` |
| getOneUpdated | function | function returning a boolean, Ex: `const isVisited = getOneVisited(field)` |
| handleSubmit | function | the function implementing all frmx submitting logic |
| hasUpdates | function |  Returns a boolean indicating wether or not the form was updated |
| resetForm | function | the function that resets the form to the initialValues state |
| setOneError | function | function accepting a boolean. Ex: `setOneError(field, true)` |
| setOneField | function | function that allows you to set a field value. Ex: `setOneField(field, value)` |
| setOneUpdated | function | function to mark a field as visited. Ex: `setOneVisited(field)` |
| useResetListener | function | If you wish to listen for reset events inside fields you built with hooks to reset them along with the rest of the form, just call this function inside your component and pass it a function to execute upon reset. Ex: `useResetListener(console.log("hi from the reset listener"))` |

**Note**: You can also test wether or not you're inside a `<Form></Form>` provider by not destructuring values right away, like so:

```js
const frmx = useForm()

if (!!frmx) {
  // ...do stuff here
  const { getOneError } = frmx
  frmx.handleSubmit()
}
```

You can check out the `<Field/>` implementation for more inspiration.
