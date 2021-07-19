# Minimalistic, Lightweight and Versatile React Forms

**frmx** is lightweight and eliminates most of the boilerplate code and headaches when building forms in React, without assuming anything about the shape of your form data or the shape of your component.

## CodeSandbox
**[Check the demo here](https://codesandbox.io/s/5g8ek?file=/src/Demo.js)**

## Mantras

- frmx starts from the shape of the data you need back
- frmx handles all of your form state
- frmx does all the heavy, repetitive & cumbersome lifting for you
- frmx assumes nothing about your inputs and their nesting / styling
- frmx provides field-based validation
- frmx allows you to create highly reusable inputs
- frmx's API is simple
- frmx is lightweight and has only one dependency, lodash
- frmx enforces best practices
- schema validation is framework agnostic, bring any functions you'd like

The goal is to allow you to write code like this and never worry about wiring state or passing stuff down the prop chain again:

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

**frmx** exposes **four components** that cover 90% of cases. Because having a hammer doesn't make everything a nail, it also exposes a **a hook** that covers the 10% remaining.

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
className={"I style directly the html form tag"}
// You will get back an object that reflects
// the difference between the intial state and the edited state
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
// Any other props will be spread on to the underlying field
{...rest}
/>
```

Note: `<FldX/>` can have only one child element, which can have some other elements nested into it, of course.

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
onChangeProp="whenIChangeI"
// defaults to "value" or "checked" for checkboxes
valueProp="myValueIs"
// defaults to "error" when nothing is passed
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
- [  ] Create a demo playground

## Roadmap

- [  ] Add TypeScript support
