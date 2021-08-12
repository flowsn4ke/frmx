---
id: frmx
title: FrmX Component
sidebar_position: 1
---

# FrmX Component

FrmX needs only two props to do its job, initialValues and onSubmit. There is, however, a number of props you can pass to make your life easier and in order to validate your form data.

## FrmX Props

| Name                    | Type           | Default       |  Description |
|----------               | -------------  | ------------- |  ------------- |
| afterChange             | function       | undefined     |  Middleware that will be called with all the form data every time it changes `afterChange(field, newFormData)` |
| autoCompleteOff         | boolean        | false         |  Disable autocomplete |
| className               | string         | undefined     |  Pass any classes to style the form tag (or div if you chose to render a div) |
| clearAfterSubmit        | boolean        | false         |  Does what it says, clears the form back to initialValues after submit |
| diff                    | string         | undefined     |  The diff algorithm you want to use if you need only the updates back from the form. Useful for things like settings etc. You'll get back the difference between the intial state and the edited state instead of all data in both `onReset` and `onSubmit`. Possible values are `"deep"` (recursive, only returns modified object elements and new array items, respecting the array structure, of course), `"shallow"` (if a nested key was updated, all of the first level key contents are returned). If you don't pass the prop or pass it with any other value, you'll get all of the form data back. Warning: The form will be deemed invalid if there are no updates |
| disabled                | boolean        | false         |  Programatically disable all inputs and buttons |
| disableIf               | function       | undefined     |  A function to check if form data is valid that takes the form data object as an argument |
| disableSubmitIfInvalid  | boolean        | false         |  The submit button will be disabled until one of the form values is updated |
| disableIfNoUpdates  | boolean        | false         |  The submit button will be disabled until the form is valid according to your rules |
| initialValues           | object         | undefined     |  The initial form data the form will be populated with |
| onInvalidSubmit         | function       | undefined     |  A callback that will be called upon invalid submit. Use either that OR disableSubmitIfInvalid |
| onReset                 | function       | undefined     |  Additional tasks to perform with or without the values upon reset |
| onSubmit                | function       | undefined     |  A callback that gets called with the form data |
| schemaValidation        | object         | undefined     |  Accepts any functions you need to validate user input on a per-field basis |
| style        | object         | undefined     |  The styles will be passed on to the `<form/>` tag or the `<div/>` tag depending on what you chose to render |
| renderDiv               | boolean        | false         |  This prop allows you to render a `<div>` tag instead of a `<form>`. Useful for nested forms that control fields, for instance |
| ...rest                 | any            | undefined     |  Any other props will be spread on to the `<form>` / `<div>` tag |

## Example Usage

```jsx
<FrmX
autoCompleteOff
className={"I style directly the html form tag"}
clearAfterSubmit
disabled={someRequestStatus === "loading"}
disableIf={formData => formData.options.breakfast.length > 15}
disableSubmitIfInvalid
initialValues={{foo:"bar"}}
onInvalidSubmit={() => alert("invalid form")}
onReset={formData => console.log("Reset!")}
onSubmit={formData => doSmthgWith(formData)}
schemaValidation={{foo: (str) => str.length > 0}}
renderDiv
updatesOnly
/>
```
