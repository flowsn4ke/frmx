import { useForm } from "../Contexts";
import { resetEvent } from "../events/eventNames";
import useDocumentListener from "./useDocumentListener";

export default function useResetListener(handler) {
  useDocumentListener(resetEvent(useForm().formId), handler)
}
