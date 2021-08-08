---
id: arrx
title: ArrX Component
sidebar_position: 5
---

# ArrX Component

`<ArrX/>` controls a `field` and helps you handle arrays in forms:

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
      // Add one empty element in the array on mount (using the provided model)
      startWithOneMore
      // the field containing the array
      field="arr"
      // The structure of one array element
      model={{ name: "", email: "" }}
      >
        {({ field, items, addItem, removeItem }) => (
          <div>
            {items.map((item, i) => (
              <div key={`unique-id-${i}`}>

                <FldX field={`${field}.${i}.name`}>
                  <input />
                </FldX>

                <FldX field={`${field}.${i}.email`}>
                  <input />
                </FldX>

                <button onClick={() => removeItem(i)}>Remove</button>
              </div>
            ))}
            <button onClick={addItem}>Add Person</button>
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
