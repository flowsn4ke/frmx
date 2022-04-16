import { useForm } from "../Contexts";
import { submitEvent } from "../events";
import { useDocumentListener } from "../libs/events-utils";

export default function useSubmitListener(handler?: () => any) {
  useDocumentListener(submitEvent(useForm().formId), handler)
}
