import { createContext, useContext } from "react"

export const FrmXContext = createContext()

export const useFrmX = () => useContext(FrmXContext)