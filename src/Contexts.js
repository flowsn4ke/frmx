import { createContext, useContext } from "react"

export const FrmXContext = createContext()
export const useFrmX = () => useContext(FrmXContext)

export const ArrXContext = createContext()
export const useArrX = () => useContext(ArrXContext)
