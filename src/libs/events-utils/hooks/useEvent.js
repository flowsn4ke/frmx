import React from "react"
import { off, on } from "../events"

export default function useEvent(target, event, handler) {
  React.useEffect(() => {
    const targetEl = target && 'current' in target ? target.current : target
    if (targetEl) on(targetEl, event, handler)
    return () => targetEl && off(targetEl, event, handler)
  }, [event, target, handler])
}
