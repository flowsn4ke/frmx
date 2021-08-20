# Roadmap

👋 Wanna join? We still need to:

## Features
- [ x ] Find a performant way to make some fields rely on each other's value. => useFldXObserver
- [ ] More custom string values for input props
- [ ] Is there a way to block unmounting when the form isn't submitted and has updates? To show a modal for example
- [ ] onSubmitIfNoUpdates
- [ ] Visibility controllers? See #1
- [ ] Callback on unmount if unsubmitted updates
- [ ] Return the error state form useFldXObserver

## Performance
- [ ] Benchmark array methods and see if there's room for improvement
- [ ] Custom .map function?

## DX Error handling
- [ ] Should we console.error when a field does not exist
- [ ] Should we continue to allow multiple instances of one field? Warn the user in dev mode?
- [ ] Debug mode?

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

- [ ] Autocomple component
- [ ] Reexport all input components from @material-ui, hooked up for frmx (from another pkg)

### Chakra UI
