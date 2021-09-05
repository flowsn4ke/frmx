# Roadmap

👋 Wanna join? We still need to:

## Features
- [ x ] Create a field observer hook. => useFldXObserver
- [ ] More custom string values for input props
- [ ] Is there a way to block unmounting when the form isn't submitted and has updates? To show a modal for example
- [ ] onSubmitIfNoUpdates
- [ ] Callback on unmount if unsubmitted updates
- [ ] Return the error state form useFldXObserver

## Performance
- [ ] Benchmark array methods and see if there's room for improvement
- [ ] Custom .map function?

## DX Error handling
- [ x ] console.warn in dev mode if a field does not exist
- [ ] console.warn in dev mode if multiple controllers of one field
- [ ] console.warn in dev mode if field is set to undefined: creates bugs for controlled components, bad practice
- [ ] Debug mode

## Testing
- [ ] Write extensive tests for diffing utils

## Documentation
- [ ] Create more example sandboxes
- [ ] Add documentation versionning
- [ ] Start recipes section
- [ ] Start tutorial section
- [ ] Start edge cases section
- [ ] Write examples (hook usage, form nesting etc.)
- [ ] Comparison to other libraries
- [ ] Field types doc
- [ ] Diff algs doc
- [ ] Write migration guides

### Tutorials
- [ ] Creating reusable components
- [ ] Manipulating arrays (with validation!)
- [ ] Create a phone field component

## TypeScript
- [ ] Add TypeScript support

## Component libraries integration

### Material UI

- [ x ] Reexport all input components from @material-ui/core
- [ ] Autocomple component (@material-ui/lab)
- [ ] Create demo

### Chakra UI

- [ ] Reexport all input components from @material-ui
