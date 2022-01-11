import { useForm } from "../Contexts";
import { resetEvent } from "../events";
import { useDocumentListener } from "react-events-utils";

export default function useResetListener(handler?: () => any) {
  useDocumentListener(resetEvent(useForm().formId), handler)
}
