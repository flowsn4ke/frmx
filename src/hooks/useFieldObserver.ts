import { useEffect, useRef, useState } from "react";
import { useForm } from "../Contexts"
import { noProviderFor } from "../utils/dx";
import { useDocumentListener } from "react-events-utils";

export default function useFieldObserver(path: string, userHandler?: (event: any) => any) {
  const frmx = useForm()

  if (!frmx) {
    noProviderFor('the useFldXObserver() hook')
    return undefined
  }

  useEffect(() => {
    frmx.registerFieldObserver(path)
  }, [])

  const [value, setValue] = useState(frmx.getOneField(path))

  const handler = useRef((event: any) => {
    const next = event.detail
    setValue(next)
    userHandler && typeof userHandler === "function" && userHandler(next)
  })

  useDocumentListener(`frmx-${frmx.formId}-set-${path}`, handler.current)

  return value
};
