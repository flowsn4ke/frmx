---
id: bindings
title: Bindings
sidebar_position: 3
---

To make it easier to use `frmx` within a UI framework, some wrappers are readily available for the following librairies (note that these packages accept frmx and the UI framework as peer dependencies, so you'll need to install both of those as well):

## Material UI

### Install

```bash
# Using npm
npm i frmx-material-ui
# Using yarn
yarn add frmx-material-ui
```

### Example

```jsx
import { Form } from 'frmx'
import { TextField } from 'frmx-material-ui'

export default function MyApp() {
  return <>
    <Form
    initialValues={{
      name:''
    }}
    onSubmit={formValues => {
      console.log(formValues)
    }}
    >
      <TextField
      path='name'
      variant='outlined'
      label='Your name here'
      />
    </Form>
  </>
}
```
