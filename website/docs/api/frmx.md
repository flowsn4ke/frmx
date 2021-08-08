---
id: frmx
title: FrmX Component
sidebar_position: 1
---

# FrmX Component

FrmX needs only two props to do its job, initialValues and onSubmit. There is, however, a number of props you can pass to make your life easier and in order to validate your form data:

```jsx
<FrmX
// the structure of your form data
initialValues={{foo:"bar"}}
// What to do with the form data
onSubmit={formData => doSmthgWith(formData)}
// Something to do with the values when you reset - or anything else
onReset={formData => console.log("Reset!")}
// Pass any classes to style the form
className={"I style directly the html form tag"}
// Get back the difference between the intial state and the edited state
// The form will be regarded as invalid if there are no updates
updatesOnly
// Disable autocomplete
autoCompleteOff
// A function to check if form data is valid that takes the form data object as an argument
disableIf={formData => formData.options.breakfast.length > 15}
// Submit button will be disabled until the form is valid according to your rules
disableSubmitIfInvalid
// Accepts any functions you need to validate your data
schemaValidation={{foo: (str) => str.length > 0}}
// A callback that will be called upon invalid submit. Use either that OR disableSubmitIfInvalid
onInvalidSubmit={() => alert("invalid form")}
// This prop allows you to render a <div> tag instead of a <form>.
// This allows for nested forms that control fields, for instance
renderDiv
// This will clear the form after submit if the form was valid and submitted
// However, there is no way to check the submit was successful as of now
clearAfterSubmit
// Any other props will be spread on to the form tag
{...rest}
/>
```
