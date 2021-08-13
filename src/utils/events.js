function on(eventType, listener) {
  document.addEventListener(eventType, listener)
}

function off(eventType, listener) {
  document.removeEventListener(eventType, listener)
}

function once(eventType, listener) {
  document.addEventListener(eventType, listener, { once: true })
  // on(eventType, handleEventOnce)

  // function handleEventOnce(event) {
  //   listener(event)
  //   off(eventType, handleEventOnce)
  // }
}

function trigger(eventType, data) {
  const event = new CustomEvent(eventType, { detail: data })
  document.dispatchEvent(event)
}

export { on, off, once, trigger }
