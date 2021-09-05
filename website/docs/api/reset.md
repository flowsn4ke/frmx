---
id: rstx
title: Reset Component
sidebar_position: 4
---

This wrapper component lets you reset all form fields to their initial state (values of the object you passed in initialValues):

```jsx
<Reset>
  <button>Reset</button>
</Reset>
```

**Note**: All props passed to `<Reset/>` will be passed on to the underlying component, including additional `onClick` logic.
