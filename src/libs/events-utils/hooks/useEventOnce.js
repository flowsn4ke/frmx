import React from "react"
import { off, once } from "../events"

export default function useEventOnce(target, event, handler) {
  React.useEffect(() => {
    const targetEl = target && 'current' in target ? target.current : target
    if (!targetEl) return

    once(targetEl, event, handler)
    return () => off(targetEl, event, handler)
  }, [event, target, handler])
}
