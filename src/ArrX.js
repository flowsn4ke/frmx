import React, { useEffect, useRef, useState } from 'react'
import cloneDeep from 'lodash-es/cloneDeep'

import { useFrmX, ArrXContext } from './Contexts'
import { noProviderFor } from './utils/dx'

export default function ArrX({
  children,
  field,
  model = "",
  startWithOneMore,
}) {
  const frmx = useFrmX()

  if (!frmx) {
    noProviderFor('<ArrX/>')
    if (children) return children
    else return null
  }

  const {
    disabled,
    getOneField,
    setOneField,
    useResetListener,
  } = frmx

  if (typeof children !== 'function') throw new Error("The <ArrX/> component only accepts a function as a child (render props). See the documentation here: https://www.frmx.io/docs/api/arrx#render-props")

  const [items, setItems] = useState(cloneDeep(getOneField(field)))

  const handleReset = useRef(() => setItems(cloneDeep(getOneField(field))))
  useResetListener(handleReset.current)

  const addItem = useRef(() => {
    const next = [...items, cloneDeep(model)]
    setItems(next)
    setOneField(field, next)
  })

  const removeItem = useRef((index) => {
    const next = cloneDeep(items).filter((_item, i) => i !== index)
    setOneField(field, next)
    setItems(next)
  })

  useEffect(() => {
    if (startWithOneMore) addItem.current()
  }, [])

  return <ArrXContext.Provider value={{ validationPath: field }}>
    {children({
      field,
      items,
      removeItem: removeItem.current,
      addItem: addItem.current,
      disabled,
    })}
  </ArrXContext.Provider>
};
