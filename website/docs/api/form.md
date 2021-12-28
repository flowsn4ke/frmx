---
id: frmx
title: Form Component
sidebar_position: 1
---

Form needs only two props to do its job, initialValues and onSubmit. There is, however, a number of props you can pass to make your life easier and in order to validate your form data.

## Form Props

| Name                    | Type           | Default       |  Description |
|----------               | -------------  | ------------- |  ------------- |
| afterChange             | function       | undefined     |  Middleware that will be called with all the form data every time it changes `afterChange(field, newFormData, errorCount, errors)` |
| autoCompleteOff         | boolean        | false         |  Disable autocomplete |
| clearAfterSubmit        | boolean        | false         |  Does what it says, clears the form back to initialValues after submit |
| disabled                | boolean        | false         |  Programatically disable all inputs and buttons. In `<FieldArray/>` you will get back this property if you need it to ensure everything is disabled when you need it in case you don't have your condition in scope. |
| disableIf               | function       | undefined     |  A function to check if form data (or the updates using the diff algorithm you chose if any) is valid. If the function returns `false`, preventing will be aborted and the function passed on to onInvalidSubmit executed instead, if any. Ex: `disableIf={updates => updates.foo.bar !== "baz"}` |
| disableIfInvalid  | boolean        | false         |  Submitting wont work until the form is valid according to your rules. If a function was passed to onInvalidSubmit, it will be executed instead. |
| disableIfNoUpdates  | boolean        | false         |  Submitting will have no effect until the form data has been changed in any way |
| initialValues           | object         | undefined     |  The initial form data the form will be populated with |
| onInvalidSubmit         | function       | undefined     |  A callback that will be called upon invalid submit. |
| onReset                 | function       | undefined     |  Additional tasks to perform with or without the values upon reset |
| onSubmit                | function       | undefined     |  A callback that gets called with the form data |
| schemaValidation        | object         | {}            |  Accepts any functions you need to validate user input on a per-field basis |
| render                  | string         | "div"         |  This prop allows you to render a `"form"` tag instead of a `"div"` or any other native html tag. `"div"` is the default in order to support nested forms that control fields (you can't have a `<form>` inside of another `<form>` in browsers, this will generate bugs). |
| ...rest                 | any            | undefined     |  Any other props will be spread on to the `<div>` / `<form>` tag depending on what you chose to render. |

## Example Usage

```jsx
<Form
autoCompleteOff
className="I style the html form tag"
clearAfterSubmit
disabled={someRequestStatus === "loading"}
disableIf={data => data.options.breakfast.length > 15}
disableIfInvalid
disableIfNoUpdates
initialValues={{foo:"bar"}}
onInvalidSubmit={() => alert("invalid form")}
onReset={data => console.log("Reset!")}
onSubmit={data => doSmthgWith(data)}
schemaValidation={{foo: (str) => str.length > 0}}
render="form"
/>
```
