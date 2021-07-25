import React, { Fragment, useEffect } from "react"
import { useFrmX } from "./FrmXContext"
import _ from "lodash"

// TODO: Update the codepen demo
export default function ArrX({
  startWithOneMore = false,
  field,
  model = "",
  children
}) {
  const { setOneField, getOneField } = useFrmX()

  const addItem = () => {
    const newArr = _.cloneDeep(getOneField(field))
    newArr.push(model)
    setOneField(field, newArr)
  }

  const removeItem = (index) => {
    const newArr = _.cloneDeep(getOneField(field))
    setOneField(field, newArr.filter((item, i) => i !== index))
  }

  useEffect(() => {
    if (startWithOneMore) addItem()
  }, [])

  return <Fragment>
    {children({ field, items: getOneField(field), removeItem, addItem })}
  </Fragment>
};