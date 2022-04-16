import React from 'react'
import clone from './utils/clone'
import { useForm, ArrayContext } from './Contexts'
import { noProviderFor } from './utils/dx'
import { resetEvent } from './events'
import { useDocumentListener } from "./libs/events-utils"

interface childrenInterface {
  path: string,
  items: Array<any>,
  removeItem(index: number): void,
  addItem(): void,
  disabled: boolean
}

interface FieldArrayPropsInterface {
  children?(object: childrenInterface): React.ReactElement,
  path: string,
  model: any,
  startWithOneMore?: boolean
}

export default function FieldArray({
  children,
  path,
  model = "",
  startWithOneMore,
}: FieldArrayPropsInterface) {
  const frmx = useForm()

  if (!frmx) {
    noProviderFor('<ArrX/>')
    if (children) return children
    else return null
  }

  const { disabled, formId, getOneField, setOneField } = frmx

  if (typeof children !== 'function') throw new Error("The <ArrX/> component only accepts a function as a child (render props). See the documentation here: https://www.frmx.dev/docs/api/arrx#render-props")

  const [items, setItems] = React.useState(getOneField(path))

  const handleReset = React.useRef(() => setItems(getOneField(path)))
  useDocumentListener(resetEvent(formId), handleReset.current)

  const addItem = React.useRef((data?: any) => {
    // TODO: Add possibility to pass data directly in the function, if empty then clone model
    const next = [...getOneField(path), clone(data || model)]
    setItems(next)
    setOneField(path, next)
  })

  const removeItem = React.useRef((index: number) => {
    const next = getOneField(path).filter((_item, i) => i !== index)
    setOneField(path, next)
    setItems(next)
  })

  React.useEffect(() => {
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
