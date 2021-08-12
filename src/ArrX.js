import React, { useEffect, useState } from 'react'
import cloneDeep from 'lodash-es/cloneDeep'

import { useFrmX, ArrXContext } from './Contexts'

export default function ArrX({
  children,
  field,
  model = "",
  startWithOneMore = false,
}) {
  const {
    disabled,
    getOneField,
    setOneField,
  } = useFrmX()

  const [items, setItems] = useState(cloneDeep(getOneField(field)))

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
