import { useForm } from "../Contexts";
import { submitEvent } from "../events";
import { useDocumentListener } from "react-events-utils";

export default function useSubmitListener(handler?: () => any) {
  useDocumentListener(submitEvent(useForm().formId), handler)
}
