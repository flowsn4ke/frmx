---
id: arrx
title: ArrX Component
sidebar_position: 5
---

# ArrX Component

`<ArrX/>` controls a `field` and helps you handle arrays in forms.

## FldX Props

| Name                    | Type           | Default       |  Description |
|----------               | -------------  | ------------- |  ------------- |
| startWithOneMore | boolean | false | Add one empty element in the array on mount (using the provided model) |
| field | string | undefined |  The field that should be controlled by frmx. You can target nested fields like so `"a.nested.field"` (lodash notation). |
| model | object | `""` | The structure of one array element, which can be of any type you need |

## Example Usage

```jsx
export default function MyComponent() {
  const initialValues = { arr: [] }

  const schemaValidation = { arr: { name: s => s.length > 3 } }

  return <>
    <FrmX
      initialValues={initialValues}
      schemaValidation={validationMethods}
      onSubmit={formData => console.log(formData)}
    >
      <ArrX
      startWithOneMore
      field="arr"
      model={{ name: "", email: "" }}
      >
        {({ field, items, addItem, removeItem, disabled }) => (
          <div>
            {items.map((item, i) => (
              <div key={`unique-id-${i}`}>

                <FldX field={`${field}.${i}.name`}>
                  <input />
                </FldX>

                <FldX field={`${field}.${i}.email`}>
                  <input />
                </FldX>

                <button disabled={disabled} onClick={() => removeItem(i)}>Remove</button>
              </div>
            ))}
            <button disabled={disabled} onClick={addItem}>Add Person</button>
          </div>
        )}
      </ArrX>
    </FrmX>
  </>
}


```

## Notes

### Render props

`<ArrX/>` uses render props that allow you to use `<FldX/>` for all the values in one array element, no matter their nesting.

### Schema validation

Schema validation only happens if there are some elements present in the array. When writing it, omit the array and write the methods as if you where directly targeting one array element.
