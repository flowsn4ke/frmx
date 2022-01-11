## v5.1.x

frmx is now entirely written in TypeScript.

## v5 Breaking changes

frmx no longer supports diffing for lack of usage. It may or may not be reincluded in the package later on.

The `renderDiv` prop for the `<Form>` component is gone, and has been replaced with the `render` prop which accepts a string with the name of the tag you wish to create. The default is `"div"` in order to support nested forms - which happends way more often than you'd think when you use frmx to handle all of your user inputs - but you can pass it any tag name, including of course the `"form"` tag (those cannot be nested).

## v4 Breaking changes

Before switching to v4, please note that components have been renamed in order to provide better interoperability between librairies.

Also, the `field` prop has been renamed to `path` to avoid confusion.

Last but not least, the `<Form />` component's `disableSubmitIfInvalid` has been renamed to `disableIfInvalid`.
