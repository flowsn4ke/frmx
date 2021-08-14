import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash-es/cloneDeep'

import { useFrmX, ArrXContext } from './Contexts'
import useDocumentListener from './hooks/useDocumentListener'

export default function ArrX({
  children,
  field,
  model = "",
  startWithOneMore,
}) {
  const {
    disabled,
    formId,
    getOneField,
    setOneField,
  } = useFrmX()

  if (typeof children !== 'function') throw new Error("The <ArrX/> component only accepts a function as a child (render props). See the documentation here: https://www.frmx.io/docs/api/arrx#render-props")

  const [items, setItems] = useState(cloneDeep(getOneField(field)))

  const handleReset = () => setItems(cloneDeep(getOneField(field)))
  useDocumentListener(`form-${formId}-reset`, handleReset)

  const addItem = () => {
    const next = [...items, cloneDeep(model)]
    setItems(next)
    setOneField(field, next)
  }

  const removeItem = (index) => {
    const next = cloneDeep(items).filter((_item, i) => i !== index)
    setOneField(field, next)
    setItems(next)
  }

  useEffect(() => {
    if (startWithOneMore) addItem()
  }, [])

  return <ArrXContext.Provider value={{ validationPath: field }}>
    {children({
      field,
      items,
      removeItem,
      addItem,
      disabled,
    })}
  </ArrXContext.Provider>
};
