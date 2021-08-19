import { useRef, useState } from "react";
import { useFrmX } from "../Contexts"
import { noProviderFor } from "../utils/dx";
import useDocumentListener from "./useDocumentListener";

export default function useFldXObserver(field, userHandler) {
  const frmx = useFrmX()

  if (!frmx) {
    noProviderFor('the useFldXObserver() hook')
    return undefined
  }

  frmx.registerFieldObserver(field)

  const [value, setValue] = useState(frmx.getOneField(field))

  const handler = useRef(e => {
    const next = e.detail
    setValue(next)
    userHandler && typeof userHandler === "function" && userHandler(next)
  })

  useDocumentListener(`frmx-${frmx.formId}-set-${field}`, handler.current)

  return value
};
