---
id: quickstart
title: Quick Start
sidebar_position: 2
---

# Quick Start

frmx is **lightweight** (~9kb minified / ~3kb gzipped), **performant** (isolates rendering using a unique combination of refs, context and synthetic events) and proposes a **simple API** while aiming to **eliminate most of the boilerplate code** (and headaches) when building forms in React, without assuming anything about the shape of your form data or the nesting of your components or the schema validation.

## Simple Form State

### Install

To get started, install `frmx` in your react project. You must be using react 16.8.0 or later as frmx relies on hooks (even though legacy support will be added in a future release):

```js
// using npm
npm i frmx
// using yarn
yarn add frmx
```

### Form, Field & Submit

The next step is to **wrap up your form in the `<Form/>` provider**. You need to provide it at least two props for the setup to work: an object `initialValues` and an `onSubmit` function the will be called with the form data. After that, you can wrap up your input in `Field` tags, just passing it the field they should control. Finally, wrap up your button component in `<Submit/>`.

```jsx
export default function MyComponent() {
  const initialValues = { foo: { bar: "baz" } }
  const onSubmit = data => console.log(data)

  <Form initialValues={initialValues} onSubmit={onSubmit}>

    <Field path="foo.bar">
      <input />
    </Field>

    <Submit>
      <button>Submit</button>
    </Submit>

  </Form>
}
```
**And just like that, your first frmx form is ready!**

Out of the box, all your inputs and the submit button will be disabled while submitting.

## Simple Form Validation

Now let's extend our previous example to add data validation.

### isErrorProp (Field) & schemaValidation (Form)

frmx accepts any function you might have to validate your data. To do so, just provide a `schemaValidation` object to `<Form/>` and an `isErrorProp` to `<Field/>`, like so:

```jsx {3,7,11}
export default function MyComponent() {
  // ...
  const schemaValidation = { foo: { bar: str => str.length > 3 } }

  <Form
    initialValues={initialValues}
    schemaValidation={schemaValidation}
    onSubmit={onSubmit}
  >

    <Field path="foo.bar" isErrorProp="error">
      <ComponentAcceptingAnErrorProp />
    </Field>

    <Submit>
      <button>Submit</button>
    </Submit>

  </Form>
}
```
**And just like that, you've implemented form validation!**

## Conclusion

This might seem cumbersome to setup compared to just using a couple of useState in react for value and error state. If your form has one or two fields and your application one or two such forms you'd be perfectly right to hesitate to use frmx.

However, **using frmx will never result in more code than any other method**, and most applications nowadays are data intensive and have a ton of forms (think settings, filters, contact forms...).

With frmx, any user input can be regarded as a form, and you can create **highly reusable inputs**, never worrying about manually rigging up state in React. As long as a you're inside a `<Form/>` component, just pass the `field` prop to your inputs and they'll automatically bubble up their values to the nearest `<Form/>` parent through React's context.

Stumbled upon a weird input from a component library? [Check `<Field/>` API](https://www.frmx.io/docs/api/fldx) to see if you can't use a prop to make it work, and if not, [just use the `useForm` hook instead](https://www.frmx.io/docs/api/usefrmx)!

That's right, you can even have **nested forms** in frmx! A form can actually serve as a field for another form for instance, ~~sky~~ your imagination is the limit.
