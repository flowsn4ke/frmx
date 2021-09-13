---
id: arrx
title: FieldArray Component
sidebar_position: 5
---

`<FieldArray/>` controls a `field` and helps you handle arrays in forms.

## FieldArray Props

| Name                    | Type           | Default       |  Description |
|----------               | -------------  | ------------- |  ------------- |
| startWithOneMore | boolean | false | Add one empty element in the array on mount (using the provided model) |
| field | string | undefined |  The field containing the array that should be controlled by `<FieldArray/>`. You can target nested fields like so `"a.nested.field"` (lodash notation). Don't  |
| model | object | `""` | The structure of one array element, which can be of any type you need |

## Example Usage

### Render props

`<FieldArray/>` uses render props that allow you to use `<Field/>` for all the values in one array element, no matter their nesting:

```jsx {17,32}
export default function MyComponent() {
  const initialValues = { arr: [] }

  const schemaValidation = { arr: { name: s => s.length > 3 } }

  return <>
    <Form
      initialValues={initialValues}
      schemaValidation={validationMethods}
      onSubmit={data => console.log(data)}
    >
      <FieldArray
      startWithOneMore
      path="arr"
      model={{ name: "", email: "" }}
      >
        {({ field, items, addItem, removeItem, disabled }) => (
          <div>
            {items.map((item, i) => (
              <div key={`unique-id-${i}`}>

                <Field path={`${field}.${i}.name`}>
                  <input />
                </Field>

                <Field path={`${field}.${i}.email`}>
                  <input />
                </Field>

                <button disabled={disabled} onClick={() => removeItem(i)}>Remove</button>
              </div>
            ))}
            <button disabled={disabled} onClick={addItem}>Add Person</button>
          </div>
        )}
      </FieldArray>
    </Form>
  </>
}


```

### Schema validation

Schema validation only happens if there are some elements present in the array. When writing it, omit the array and write the methods as if you where directly targeting one array element:

```js
  const initialValues = { arr: [] }

  const schemaValidation = { arr: { name: s => s.length > 3 } }
```
