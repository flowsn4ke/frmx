---
id: frmx
title: FrmX Component
sidebar_position: 1
---

# FrmX Component

FrmX needs only two props to do its job, initialValues and onSubmit. There is, however, a number of props you can pass to make your life easier and in order to validate your form data:

```jsx
<FrmX
// Disable autocomplete
autoCompleteOff
// Pass any classes to style the form
className={"I style directly the html form tag"}
// Does what it says, clears the form back to initialValues after submit
clearAfterSubmit
// Programatically disable all inputs and buttons
disabled={someRequestStatus === "loading"}
// A function to check if form data is valid that takes the form data object as an argument
disableIf={formData => formData.options.breakfast.length > 15}
// Submit button will be disabled until the form is valid according to your rules
disableSubmitIfInvalid
// the structure of your form data
initialValues={{foo:"bar"}}
// Get back the difference between the intial state and the edited state
// The form will be regarded as invalid if there are no updates
onInvalidSubmit={() => alert("invalid form")}
// Something to do with the values when you reset - or anything else
onReset={formData => console.log("Reset!")}
// What to do with the form data
onSubmit={formData => doSmthgWith(formData)}
// Accepts any functions you need to validate your data
schemaValidation={{foo: (str) => str.length > 0}}
// This prop allows you to render a <div> tag instead of a <form>.
// This allows for nested forms that control fields, for instance
renderDiv
// Any other props will be spread on to the form tag
updatesOnly
// A callback that will be called upon invalid submit. Use either that OR disableSubmitIfInvalid
{...rest}
/>
```
