import cloneDeep from 'lodash-es/cloneDeep'
import { useState, useRef } from 'react'
import { useFrmX } from '../Contexts'

export default function useFldX(field) {
  const {
    disabled: formIsDisabled,
    getOneField,
    setOneError,
    setOneField,
    useResetListener,
  } = useFrmX()

  const [value, setValue] = useState(cloneDeep(getOneField(field)))
  const [error, setError] = useState(false)

  const handleReset = useRef(() => setValue(cloneDeep(getOneField(field))))
  useResetListener(handleReset.current)

  const onChange = useRef((val) => {
    setValue(val)
    setOneField(field, val)
  })
  const handleError = useRef((isError) => {
    setError(isError)
    setOneError(field, isError)
  })

  return {
    value,
    setValue: onChange.current,
    error,
    setError: handleError.current,
    disabled: formIsDisabled,
  }
}
