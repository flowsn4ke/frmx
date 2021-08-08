# Minimalistic, Lightweight and Versatile React Forms

**frmx** is lightweight and eliminates most of the boilerplate code and headaches when building forms in React, without assuming anything about the shape of your form data or the shape of your component.

## CodeSandbox
**[Check the demo here](https://codesandbox.io/s/5g8ek?file=/src/Demo.js)**

## Mantras

- Start from the shape of the data we need back
- Form state management is abstracted away
- Provide defaults that cover 90% of the cases
- Keep the API as simple as possible
- Assumes nothing about inputs and their nesting / styling
- Provide field-based validation
- Allow for creating highly reusable inputs
- Keep frmx as lightweight as possible (~21kb as of today)
- Keep schema validation framework agnostic, bring any functions you'd like

Overall, the goal is to allow you to write code like this and never worry about wiring state or passing stuff down the prop chain again:

```js
<FrmX
initialValues={{foo: "", bar: {baz:""}}}
onSubmit={formData => doSmthg(formData)}
// disableSubmitIfInvalid // comment out onInvalidSubmit to use this prop!
// disableIfNoUpdates // Additional rules to disable submission
onInvalidSubmit={() => alert("invalid form")}
schemaValidation={foo, bar:{baz: (str) => str.length > 2}}
>
    <CustomInput1 field="bar.baz" />
    <CustomInput2 field="foo" />
    <CustomSubmitButton />
</FrmX>
```

The state is automatically passed on to the nearest FrmX ancestor through React's Context. State stays local though and you can have as many forms as you want even with similar field names as long as they're inside different `<FrmX/>` tags.

## API

**frmx** exposes **five components** that cover 90% of cases. Because having a hammer doesn't make everything a nail, it also exposes a **a hook** that covers the 10% remaining.

### Quick Start

It is recommended you use the components whenever possible.

```js
import { FrmX, FldX, BtnX } from "frmx"
import { TextField, Checkbox, Button } from "@material-ui/core"
// or any other input you'd like that uses value and onChange
// if the props are named differently you can pass the prop names to FldX

export default MyComponent() {
    return (
    <FrmX
    initialValues={{
        foo: "",
        bar: {
            baz: false
        }
    }}
    onSubmit={formData => alert(JSON.stringify(formData, null, 2))}
    >

    <FldX field="foo">
        <TextField>
    </FldX>

    <FldX field="bar.baz" type="checkbox">
        <Checkbox>
    </FldX>

    <BtnX>

    // The button will be automagically disabled when submitting
    // Feel free to pass additionnal logic to BtnX to disable it
    </BtnX>
        <Button>Submit</Button>
    </FrmX>
    )
}
```

### FrmX Component

FrmX needs only two props to do its job, `initialValues` and `onSubmit`. There is, however, a number of props you can pass to make your life easier and to validate your form data:
```js
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

### FldX Component

A glance at all the props FldX uses at the moment:

```js
<FldX
// You can target nested fields like so
field="a.nested.field"
// The type of your input, defaults to "text"
type="text"
// A function to check the input is valid
validate={(value) => typeof value === "string"}
// The name of the prop used by the underlying component
// to trigger an error state. Defaults to "error"
isErrorProp
// The name of the prop used to update the component with its value
// Defaults to "onChange"
onChangeProp
// The name of the component that holds the field's value
// Defaults to "value"
valueProp
// A boolean that indicates wether or not this is required
// Before submitting the form
required
// A boolean to disable autocorrect
autoCorrectOff
// A boolean to disable autocapitalize
autoCapitalizeOff
// Pass a custom function to get back the value from the onChange args
// Useful for instance when interacting with material ui components
// As they often pass the new value through the second argument
// Example: <FldX ... getValueFromArgs={args => args[1].value}>...</FldX>
getValueFromArgs
// Any other props will be spread on to the underlying field
{...rest}
/>
```

Note: **Use only "." notation, even for array elements**, otherwise you will run into bugs. For instance, to access the string `"baz"` in `{a: ["bar", {b: "baz"}]}}`, you would give the field `"a.1.b"`.

Note: `<FldX/>` can have only one child element, which can have some other elements nested into it, of course.

### ArrX Component

A simple wrapper that exposes function to make working with array a breeze. It's meant to manipulate one of FrmX fields which is an array. It uses render props to pass down a few utilities, such as adding / removing elements. It expects a model to add new fields.

If you pass a method to validate an array, the validation method will be the same for all array items. You can use the `disableIf` prop on `<FrmX/>` should you wish to target a specific array element by index.

It accepts `<FldX/>` fields as descendents that can reuse the `field` prop from `<ArrX/>` for convenience and to avoid mistakes.

```js
<FrmX
initialValues={{arr:[]}}
onSubmit={formData => doSmthg(formData)}
>
  <ArrX
  // A prop to add one element from the start into the array so we can start editing
  startWithOneMore
  // The path corresponding to the array we want to edit
  field="arr"
  // The initial values for each new element in the array
  model={{ name: "", email: "" }}
  >
    {({ field, items, addItem, removeItem }) => // Here we get back some self-explanatory utilities
      <Box>

        {items.map((item, i) => <Box key={`unique-id-${i}`}>
        <FldX field={`${field}.${i}.name`}>
          <TextField className={classes.input} variant="outlined" label="Name" />
        </FldX>
        <FldX field={`${field}.${i}.email`}>
          <TextField className={classes.input} variant="outlined" label="Email" />
        </FldX>

        <Button onClick={() => removeItem(i)}>Remove</Button>
      </Box>)}
    <Button onClick={addItem}>Add Person</Button>
    </Box>}
  </ArrX>
</FrmX>
```

### BtnX Component

This components passes a type of "submit" to the underlying button and triggers form submission when the button is clicked or when enter is pressed while editing the form. You can pass it a `disabled` condition, like so (it will be automatically disabled while submitting):

```js
<BtnX disabled={passwordDoNotMatch && noEmailWasProvided}>
  <button>Submit</button>
</BtnX>
```

### RstX Component

This components lets you reset the fields to the values of the object you passed in initialValues:

```js
<RstX>
  <button>Reset</button>
</RstX>
```

### Edge Cases

Once in a while you might encounter components that have weird props for managing their state. In those cases, you can pass props to `<FldX/>` like so:

```js
<FldX
// defaults to "text"
type="email"
// defaults to "onChange"
onChangeProp="whenIChangeIDoSomething"
// defaults to "value" or "checked" for checkboxes
valueProp="myValueIs"
// no defaults
isErrorProp="ifThisIHaveAnError"
>
    <MyComponent>
</FldX>
```

In some rare cases, you might not be able to use `FldX` because of some input wrapper for instance. In those cases you can you the hook to manually update and get back the values for this specific field:

```js
import { FrmX, FldX, BtnX, useFrmX } from "frmx"
import { TextField, Button } from "@material-ui/core"
import { WeirdInput } from "some-random-pkg"

export default MyComponent({field}) {
    const {
      setOneField,
      getOneField,
      setOneVisited,
      getOneError,
      setOneError,
      getIsSubmitting
    } = useFrmX()

    return (
    <FrmX
    initialValues={{
        foo: "",
        bar: {
            baz: false
        }
    }}
    onSubmit={formData => alert(JSON.stringify(formData, null, 2))}
    >

        <FldX field="foo">
            <TextField>
        </FldX>

        <FldX field="bar.baz" type="checkbox">
            <WeirdInput
            iChangeLikeThat={( a, b, c ) => {
                doSomethingWith(a)
                doSomethingWith(b)
                doSomethingWith(c)
                setOneField(field, [ a, b, c])
            }}
            myValue={getOneField(field)}
            >
        </FldX>

        <BtnX>
            <Button>Submit</Button>
        </BtnX>
    </FrmX>
    )
}
```

### Hints

Field values will bubble up to the neirest `<FrmX>` form you defined. You can include this in all your field components and compose your forms as you'd like, never thinking about having to manage field state again. To do so, you might want to set up your components to accept a `field` prop that you will then pass to `<FldX/>` or to the functions you got back from the hook.

## TODOs

- [ X ] Add a onInvalidSubmit prop to pass a function to FrmX
- [ X ] Keep track of errors and general form validity
- [  ] Opt-in value trimming on a per field basis
- [  ] Write examples (hook usage, form nesting etc.)
- [  ] Write tests

## Roadmap

- [  ] Add TypeScript support
