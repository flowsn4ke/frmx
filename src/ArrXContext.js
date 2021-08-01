import { createContext, useContext } from "react"

export const ArrXContext = createContext()

export const useArrX = () => useContext(ArrXContext)
