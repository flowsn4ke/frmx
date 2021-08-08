import React, { useEffect } from "react"
import { useFrmX, ArrXContext } from "./Contexts"
import { cloneDeep } from "lodash"

export default function ArrX({
  startWithOneMore = false,
  field,
  model = "",
  children
}) {
  const {
    setOneField,
    getOneField,
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
      addItem
    })}
  </ArrXContext.Provider>
};
