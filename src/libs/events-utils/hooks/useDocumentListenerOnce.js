import useEventOnce from "./useEventOnce"

export default function useDocumentListenerOnce(event, handler) {
  useEventOnce(typeof window === 'undefined' ? undefined : document, event, handler)
};
