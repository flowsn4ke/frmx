---
id: usefrmx
title: useFrmX Hook
sidebar_position: 6
---

# useFrmX Hook

The `useFrmX` hook must be consumed inside a `<FrmX/>` provider, as it uses its context.


## useFrmX

In some rare cases, you might not be able to use FldX because of some input wrapper for instance (which happens with some Material UI fields). You can then use the `useFrmX` hook to manually update and get back the values for this specific field. This field should maintain its own state and update the values (and) held by frmx as a side effect, like so:

### Example Usage

```jsx
import React, { useState } from 'react'
import { FrmX, FldX, BtnX, useFrmX } from "frmx"
import { TextField, Button } from "@material-ui/core"
import { WeirdInput } from "some-random-pkg"

function CustomCheckboX({field}) {
  const {
    getOneField,
    setOneField,
  } = useFrmX()

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

**The good news is, once you've created a wrapper around this input, you can reuse it everywhere in your application, and it needs only one prop to operate (the field it should control, that is). It will be automagically linked to the nearest frmx parent through React's Context API**

**Note**: It's also important your remember to do the exact same thing for the error state: Keep track of it locally and update it in frmx as a side effect if you need to validate that input

### Full API reference

To do so, you can destructure all values frmx interacts with like so (assuming you're inside a `<FrmX></FrmX>` provider):

| Name                    | Type           |    Description |
|----------               | -------------  |  ------------- |
| getOneError | function | function that returns if the field has an error. Ex: `const isError = getOneError(field)` |
| getOneField | function | function that returns a field value. Ex: `const value = getOneField(field)` |
| getOneUpdated | function | function returning a boolean, Ex: `const isVisited = getOneVisited(field)` |
| handleSubmit | function | the function implementing all frmx submitting logic |
| hasUpdates | function |  Returns a boolean indicating wether or not the form was updated |
| resetForm | function | the function that resets the form to the initialValues state |
| setOneError | function | function accepting a boolean. Ex: `setOneError(field, true)` |
| setOneField | function | function that allows you to set a field value. Ex: `setOneField(field, value)` |
| setOneUpdated | function | function to mark a field as visited. Ex: `setOneVisited(field)` |

**Note**: You can also test wether or not you're inside a `<FrmX></FrmX>` provider by not destructuring values right away, like so:

```js
const frmx = useFrmX()

if (!!frmx) {
  // ...do stuff here
  const { getOneError } = frmx
  frmx.handleSubmit()
}
```

You can check out the `<FldX/>` implementation for more inspiration.
