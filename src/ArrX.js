import React, { useCallback, useEffect } from 'react'
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

  const addItem = useCallback(() => {
    const newArr = cloneDeep(getOneField(field))
    newArr.push(cloneDeep(model))
    setOneField(field, newArr)
  }, [getOneField, field, setOneField])

  const removeItem = useCallback((index) => {
    const newArr = cloneDeep(getOneField(field))
    setOneField(field, newArr.filter((item, i) => i !== index))
  }, [getOneField, field, setOneField])

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
