---
id: btnx
title: Submit Component
sidebar_position: 3
---

This components passes a type of "submit" to the underlying button if you passed the `render="form"` prop to `<Form/>` and triggers form submission when the button is clicked or when enter is pressed while editing the form (or an onClick function if you passed the `render="div"` prop to `<Form/>`).

The button will be automatically disabled when submitting or depending on disabling props you might have passed to `<Form/>`. You also can pass it additionnal disabling logic, like so:

```jsx
<Submit disabled={someCondition && someOtherCondition}>
  <button>Submit</button>
</Submit>
```
