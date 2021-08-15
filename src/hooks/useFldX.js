import cloneDeep from 'lodash-es/cloneDeep'
import { useState, useRef } from 'react'
import { useFrmX } from '../Contexts'

export default function useFldX(field) {
  const frmx = useFrmX()

  if (!frmx) return undefined

  const {
    disabled: formIsDisabled,
    getOneField,
    setOneError,
    setOneField,
    useResetListener,
  } = frmx

  const [value, setValue] = useState(cloneDeep(getOneField(field)))
  const [error, setError] = useState(false)

  const handleReset = useRef(() => setValue(cloneDeep(getOneField(field))))
  useResetListener(handleReset.current)

  const onChange = useRef((val) => {
    const newVal = typeof val === "function" ? val(value) : val
    setValue(newVal)
    setOneField(field, newVal)
  })
  const handleError = useRef((err) => {
    const newErr = typeof err === "function" ? err(error) : err
    setError(newErr)
    setOneError(field, newErr)
  })

  return {
    value,
    setValue: onChange.current,
    error,
    setError: handleError.current,
    disabled: formIsDisabled,
  }
}
