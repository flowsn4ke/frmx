import React, { useEffect, useRef, useState } from 'react'
import clone from './utils/clone'
import { useForm, ArrayContext } from './Contexts'
import { noProviderFor } from './utils/dx'
import { resetEvent } from './events/eventNames'
import useDocumentListener from './hooks/useDocumentListener'

export default function FieldArray({
  children,
  path,
  model = "",
  startWithOneMore,
}) {
  const frmx = useForm()

  if (!frmx) {
    noProviderFor('<ArrX/>')
    if (children) return children
    else return null
  }

  const { disabled, formId, getOneField, setOneField } = frmx

  if (typeof children !== 'function') throw new Error("The <ArrX/> component only accepts a function as a child (render props). See the documentation here: https://www.frmx.io/docs/api/arrx#render-props")

  const [items, setItems] = useState(getOneField(path))

  const handleReset = useRef(() => setItems(getOneField(path)))
  useDocumentListener(resetEvent(formId), handleReset.current)

  const addItem = useRef(() => {
    // TODO: Add possibility to pass data directly in the function, if empty then clone model
    const next = [...getOneField(path), clone(model)]
    setItems(next)
    setOneField(path, next)
  })

  const removeItem = useRef((index) => {
    const next = getOneField(path).filter((_item, i) => i !== index)
    setOneField(path, next)
    setItems(next)
  })

  useEffect(() => {
    if (startWithOneMore) addItem.current()
  }, [])

  return <ArrayContext.Provider value={{ validationPath: path }}>
    {children({
      path,
      items,
      removeItem: removeItem.current,
      addItem: addItem.current,
      disabled,
    })}
  </ArrayContext.Provider>
};
