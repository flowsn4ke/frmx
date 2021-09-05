---
id: frmx
title: Form Component
sidebar_position: 1
---

Form needs only two props to do its job, initialValues and onSubmit. There is, however, a number of props you can pass to make your life easier and in order to validate your form data.

## Form Props

| Name                    | Type           | Default       |  Description |
|----------               | -------------  | ------------- |  ------------- |
| afterChange             | function       | undefined     |  Middleware that will be called with all the form data every time it changes `afterChange(field, newFormData)` |
| autoCompleteOff         | boolean        | false         |  Disable autocomplete |
| clearAfterSubmit        | boolean        | false         |  Does what it says, clears the form back to initialValues after submit |
| diff                    | string         | undefined     |  The diff algorithm you want to use if you need only the updates back from the form. Useful for things like settings etc. You'll get back the difference between the intial state and the edited state instead of all data in both `onReset` and `onSubmit`. Possible values are `"deep"` (recursive, only returns modified object elements and new / modified array items), `"keys"` (recursive as well, returns only modified object key properties and complete arrays if they were updated in any way) & `"shallow"` (if a nested key was updated, all of the first level key contents are returned). If you don't pass the prop or pass it with any other value, you'll get all of the form data back. Warning: The form will be deemed invalid if there are no updates |
| disabled                | boolean        | false         |  Programatically disable all inputs and buttons. In `<FieldArray/>` you will get back this property if you need it to ensure everything is disabled when you need it in case you don't have your condition in scope. |
| disableIf               | function       | undefined     |  A function to check if form data (or the updates using the diff algorithm you chose if any) is valid. If the function returns `false`, preventing will be aborted and the function passed on to onInvalidSubmit executed instead, if any. Ex: `disableIf={updates => updates.foo.bar !== "baz"}` |
| disableIfInvalid  | boolean        | false         |  Submitting wont work until the form is valid according to your rules. If a function was passed to onInvalidSubmit, it will be executed instead. |
| disableIfNoUpdates  | boolean        | false         |  Submitting will have no effect until the form data has been changed in any way |
| initialValues           | object         | undefined     |  The initial form data the form will be populated with |
| onInvalidSubmit         | function       | undefined     |  A callback that will be called upon invalid submit. |
| onReset                 | function       | undefined     |  Additional tasks to perform with or without the values upon reset |
| onSubmit                | function       | undefined     |  A callback that gets called with the form data |
| schemaValidation        | object         | {}            |  Accepts any functions you need to validate user input on a per-field basis |
| renderDiv               | boolean        | false         |  This prop allows you to render a `<div>` tag instead of a `<form>`. Useful for nested forms that control fields, for instance |
| ...rest                 | any            | undefined     |  Any other props will be spread on to the `<form>` / `<div>` tag depending on what you chose to render. |

## Example Usage

```jsx
<Form
autoCompleteOff
className={"I style directly the html form tag"}
clearAfterSubmit
disabled={someRequestStatus === "loading"}
disableIf={formData => formData.options.breakfast.length > 15}
disableIfInvalid
disableIfNoUpdates
initialValues={{foo:"bar"}}
onInvalidSubmit={() => alert("invalid form")}
onReset={formData => console.log("Reset!")}
onSubmit={formData => doSmthgWith(formData)}
schemaValidation={{foo: (str) => str.length > 0}}
renderDiv
/>
```
