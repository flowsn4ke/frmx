---
id: validatingData
title: Validating data
sidebar_position: 2
---

## Real time data validation

One of the advantages of frmx's architecture is that **error handling happens in real time**.

### Errors, 2 in 1: UX and Schema validation

To do so, frmx checks user input against the validation method you defined in your schemaValidation object if you provided one to the `<FrmX/>` component every time it changes and inform the nearest frmx provider if it contains errors or not.

However, showing errors to users right away is pretty much always a bad idea. To delay the error state of the UI, the common approach is to keep track of a "touched" variable that is set to `true` when the field is blurred (when it was focused then unfocused).

frmx goes a step further and keeps track of another variable for you in both the `<FldX/>` component and the `useFldX` hook: `validOnce`. If the user input was previously valid and is regressed back to an invalid state, the UX should reflect it.

### Setting up schema validation

Let's say you have an `initialValues` object that looks like this:

```js
const initialValues = {
  foo: "bar",
  options:
   {
     hello: "world"
    }
  }
```

Defining schema validation is a simple as copying the `initialValues` structure and defining functions instead of values at each level:

```js
const schemaValidation = {
  foo: (value) => value.length > 2,
  options:
   {
     hello: value => value.length > 4
    }
  }
```

All that's left is to pass those two objects to the `<FrmX/>` provider:

```jsx
<FrmX
initialValues={initialValues}
schemaValidation={schemaValidation}
onSubmit={formData => console.log(formData)}
>
  {/* Here be some form fields */}
<FrmX>
```

### Validating arrays

It's recommanded that you use the `<ArrX/>` component when working with arrays in frmx. That way you can easily write data validation for each and every array element, no matter its structure! Otherwise you can just write validation based on indeces, but that would be cumbersome, right?

When working with `<ArrX/>`, write schema validatio like so:

```js
const initialValues={
  foo: [ { name: "bar" }, { name: "baz" } ]
}
const schemaValidation={
  foo: {
    name: value => value.length > 3
  }
}
```

**In other words, just write validation as if you were working with one array element instead of an array**! frmx will take care of validation for you, assuming you're using `<FldX/>` components as children of `<ArrX/>`, of course.

### Preventing users from submitting invalid data

To prevent users from submitting data that doesn't match your schema validation, just pass the `disableSubmitIfInvalid` prop to `<FrmX/>`, which will prevent your `onSubmit` function from running.

### Reacting to invalid submit events

If you passed a function to the `onInvalidSubmit` prop, it will be executed instead (it also accepts a callback that will receive the current form data as first argument). If you passed the `onInvalidSubmit` prop, you can omit the `disableSubmitIfInvalid` prop.

```jsx
<FrmX
onSubmit={formData => console.log("valid data:", formData)}
disableSubmitIfInvalid
onInvalidSubmit={formData => console.log("invalid data:", formData)}
>
  {/* Here be some form fields */}
</FrmX>
```

### Preventing unmodified forms from being submitted

It's good practice to prevent users from submitting form data that hasn't changed the slightest. To do so, you can just pass the `disableIfNoUpdates` prop to `<FrmX/>` and / or the `diff` prop with the name of the algorithm you wish to use when getting form data back

Quick reminder: you can use one of the three following values for the `diff` prop: `"shallow"` in order to get modified first level key with all of their children if they have any, `"keys"` if you wish to only get back the modified keys, for instance of two nested keys only the one that was modified will be included, respecting its original path, of course, but modified arrays will be sent back in their integrality, and at last `"deep"`, which will provide a recursive diff between the initial values and the new form data, sending only new / midified array elements with no respect for their index.

### Formatting data

Formatting data in frmx doesn't have it's own prop, simply because it doesn't need to: Formatting can happen in the `onSubmit` callback.

## Differed validation

However, you can also opt for differed data validation using a prop called `disableIf` and passing it to the `<FrmX/>` provider. You should pass it a function that will accept the current form data and will only be executed at submit time to check if it's valid or not. The function should return `true` if the submit should be prevented, or `false` if the data is valid and the form can be submitted.
