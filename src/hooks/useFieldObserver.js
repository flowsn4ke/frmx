import { useEffect, useRef, useState } from "react";
import { useForm } from "../Contexts"
import { noProviderFor } from "../utils/dx";
import useDocumentListener from "./useDocumentListener";

export default function useFieldObserver(field, userHandler) {
  const frmx = useForm()

  if (!frmx) {
    noProviderFor('the useFldXObserver() hook')
    return undefined
  }

  useEffect(() => {
    frmx.registerFieldObserver(field)
  }, [])

  const [value, setValue] = useState(frmx.getOneField(field))

  const handler = useRef(e => {
    const next = e.detail
    setValue(next)
    userHandler && typeof userHandler === "function" && userHandler(next)
  })

  useDocumentListener(`frmx-${frmx.formId}-set-${field}`, handler.current)

  return value
};
