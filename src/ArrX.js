import React, { Fragment, useEffect } from "react"
import { useFrmX } from "./FrmXContext"
import { cloneDeep } from "lodash"

// TODO: Update the codepen demo
export default function ArrX({
  startWithOneMore = false,
  field,
  model = "",
  children
}) {
  const { setOneField, getOneField } = useFrmX()

  const addItem = () => {
    const newArr = cloneDeep(getOneField(field))
    newArr.push(model)
    setOneField(field, newArr)
  }

  const removeItem = (index) => {
    const newArr = cloneDeep(getOneField(field))
    setOneField(field, newArr.filter((item, i) => i !== index))
  }

  useEffect(() => {
    if (startWithOneMore) addItem()
  }, [])

  return <Fragment>
    {children({ field, items: getOneField(field), removeItem, addItem })}
  </Fragment>
};
