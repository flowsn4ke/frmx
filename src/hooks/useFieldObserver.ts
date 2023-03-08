import { useEffect, useRef, useState } from "react";
import { useForm } from "../Contexts"
import { noProviderFor } from "../utils/dx";
import { useDocumentListener } from "../libs/events-utils";
import { setEvent, resetEvent } from "../events"

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

  const setHandler = useRef((event: any) => {
    const next = event.detail
    setValue(next)
    userHandler && typeof userHandler === "function" && userHandler(next)
  })

  const resetHandler = useRef((event: any) => {
    setValue(frmx.getOneField(path))
  })

  useDocumentListener(setEvent(frmx.formId, path), setHandler.current)
  useDocumentListener(resetEvent(frmx.formId), resetHandler.current)

  return value
};
