import { useForm } from "../Contexts";
import { submitEvent } from "../events/eventNames";
import useDocumentListener from "./useDocumentListener";

export default function useSubmitListener(handler) {
  const { formId } = useForm()
  useDocumentListener(submitEvent(formId), handler)
}
