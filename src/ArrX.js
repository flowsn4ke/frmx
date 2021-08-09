import React, { useEffect } from 'react'
import cloneDeep from 'lodash-es/cloneDeep'

import { useFrmX, ArrXContext } from './Contexts'

export default function ArrX({
  startWithOneMore = false,
  field,
  model = "",
  children
}) {
  const {
    disabled,
    getOneField,
    setOneField,
  } = useFrmX()

  const addItem = () => {
    const newArr = cloneDeep(getOneField(field))
    newArr.push(cloneDeep(model))
    setOneField(field, newArr)
  }

  const removeItem = (index) => {
    const newArr = cloneDeep(getOneField(field))
    setOneField(field, newArr.filter((item, i) => i !== index))
  }

  useEffect(() => {
    if (startWithOneMore) addItem()
  }, [startWithOneMore, addItem])

  return <ArrXContext.Provider value={{ validationPath: field }}>
    {children({
      field,
      items: getOneField(field),
      removeItem,
      addItem,
      disabled,
    })}
  </ArrXContext.Provider>
};
