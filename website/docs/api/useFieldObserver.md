---
id: usefldxobserver
title: useFieldObserver Hook
sidebar_position: 8
---

Most applications need to listen to changes in other fields in order to conditionally display / set other fields.
Starting from v3.8.2, you can use the useFieldObserver hook to achieve just that.

The `useFieldObserver` hook must be consumed inside a `<Form/>` provider, as it uses its context.

## Example Usage

```jsx
import { useFieldObserver } from 'frmx'

export function MyComponent(props) {
  const { field } = props
  const optionalHandler = (newVal) => alert(newVal)
  const latestValue = useFieldObserver(field, optionalHandler)

  return <>
    <div>The latest value from {field} is {latestValue}</div>
  </>
}
```

## Return Value

The useFieldObserver hook only **returns the field value** as of today (we plan to start including the error state in a future version) and accepts one **optional handler function as a second argument** which will be executed with the observed field latest value if provided at all.
