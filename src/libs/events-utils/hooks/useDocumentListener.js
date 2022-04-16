import useEvent from "./useEvent"

export default function useDocumentListener(event, handler) {
  useEvent(typeof window === 'undefined' ? undefined : document, event, handler)
}
