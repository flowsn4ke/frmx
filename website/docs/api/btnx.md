---
id: btnx
title: BtnX Component
sidebar_position: 3
---

This components passes a type of "submit" to the underlying button and triggers form submission when the button is clicked or when enter is pressed while editing the form (or an onClick function if you passed the `renderDiv` prop to `<FrmX/>`).

The button will be automatically disabled when submitting or depending on disabling props you might have passed to `<FrmX/>`. You also can pass it additionnal disabling logic, like so:

```jsx
<BtnX disabled={someCondition && someOtherCondition}>
  <button>Submit</button>
</BtnX>
```
