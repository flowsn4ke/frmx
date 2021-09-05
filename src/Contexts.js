import { createContext, useContext } from 'react'

export const FormContext = createContext()
export const useForm = () => useContext(FormContext)

export const ArrayContext = createContext()
export const useArray = () => useContext(ArrayContext)
