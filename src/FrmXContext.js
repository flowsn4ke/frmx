import { createContext, useContext } from "react"

export const FrmXContext = createContext()

export const useFrmX = () => {
  const frmx = useContext(FrmXContext)

  if (!frmx) throw new Error("Can't consume the useFrmX hook outside of the <FrmX/> provider.")
  else return frmx
}
