import React, { useEffect, useRef, useState } from 'react'
import cloneDeep from 'lodash/cloneDeep'

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

  const {
    disabled,
    formId,
    getOneField,
    setOneField,
  } = frmx

  if (typeof children !== 'function') throw new Error("The <ArrX/> component only accepts a function as a child (render props). See the documentation here: https://www.frmx.io/docs/api/arrx#render-props")

  const [items, setItems] = useState(cloneDeep(getOneField(path)))

  const handleReset = useRef(() => setItems(cloneDeep(getOneField(path))))
  useDocumentListener(resetEvent(formId), handleReset.current)

  const addItem = useRef(() => {
    const next = [...getOneField(path), cloneDeep(model)]
    setItems(next)
    setOneField(path, next)
  })

  const removeItem = useRef((index) => {
    const next = cloneDeep(getOneField(path)).filter((_item, i) => i !== index)
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
