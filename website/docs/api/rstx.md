---
id: rstx
title: RstX Component
sidebar_position: 4
---

This wrapper component lets you reset all form fields to their initial state (values of the object you passed in initialValues):

```jsx
<RstX>
  <button>Reset</button>
</RstX>
```

**Note**: All props passed to `<RstX/>` will be passed on to the underlying component, including additional `onClick` logic.
