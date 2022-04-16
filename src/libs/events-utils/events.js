function on(target, eventType, listener) {
  target.addEventListener(eventType, listener)
}

function off(target, eventType, listener) {
  target.removeEventListener(eventType, listener)
}

function once(target, eventType, listener) {
  target.addEventListener(eventType, listener, { once: true })
}

function trigger(eventType, data) {
  const event = new CustomEvent(eventType, { detail: data })
  document.dispatchEvent(event)
}

export { on, off, once, trigger }