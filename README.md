![license](https://img.shields.io/github/license/flowsn4ke/frmx)
![latest version](https://img.shields.io/npm/v/frmx)
![last commit](https://img.shields.io/github/last-commit/flowsn4ke/frmx)
![bundle size](https://img.shields.io/bundlephobia/minzip/frmx)
![total stars](https://img.shields.io/github/stars/flowsn4ke/frmx)
![downloads](https://img.shields.io/npm/dt/frmx)
![open issues](https://img.shields.io/github/issues-raw/flowsn4ke/frmx)

# Simple, Performant, Lightweight React Forms

**frmx** is lightweight (~9kb minified / ~3kb gzipped) and eliminates most of the boilerplate code and headaches when building forms with React, without assuming anything about the shape of your form data or the nesting / styling of your component.

But, unlike other librairies, you can take frmx one step further and use it to manager *all kinds of user inputs*, such as **settings** or complex **search filters** for instance.

It is heavily relied on in production at my company (it actually manages **all** user inputs) and used by several thousands users a month, yet having no known (open) issue.

## CodeSandbox

**[Check the demo here](https://codesandbox.io/s/5g8ek?file=/src/Demo.js)**

## Docs

**[Check the documentation here](https://frmx.dev/)**

## Goal

Overall, the goal is to start from the data you need and allow you to write code like this and never worry about wiring state or passing stuff down the prop chain again:

```js
<Form
initialValues={{foo: "", bar: {baz:""}}}
onSubmit={data => doSmthg(data)}
// disableSubmitIfInvalid // comment out onInvalidSubmit to use this prop!
// disableIfNoUpdates // Additional rules to disable submission
onInvalidSubmit={() => alert("invalid form")}
schemaValidation={{ bar: { baz: str => str.length > 2 } }}
>
    <CustomInput1 path="bar.baz" />
    <CustomInput2 path="foo" />
    <CustomSubmitButton />
</Form>
```

## How it works

To get both performance and flexibility with a simple API, `frmx` uses React's **context API only to store refs**, expose a few getter / setters methods and give forms a unique id. That way, updating form data doesn't trigger rerendering everything inside the `<Form/>` component. All **fields keep track of their own state** and only update the refs as a **side effect**, while various events regarding form validity / submitting / resetting are passed through **synthetic events** that do not trigger rerenders of the context provider itself.

## v5 Breaking changes

frmx no longer supports diffing for lack of usage. It may or may not be reincluded in the package later on.

The `renderDiv` prop for the `<Form>` component is gone, and has been replaced with the `render` prop which accepts a string with the name of the tag you wish to create. The default is `"div"` in order to support nested forms - which happends way more often than you'd think when you use frmx to handle all of your user inputs - but you can pass it any tag name, including of course the `"form"` tag (those cannot be nested).

## v4 Breaking changes

Before switching to v4, please note that components have been renamed in order to provide better interoperability between librairies.

Also, the `field` prop has been renamed to `path` to avoid confusion.

Last but not least, the `<Form />` component's `disableSubmitIfInvalid` has been renamed to `disableIfInvalid`.
