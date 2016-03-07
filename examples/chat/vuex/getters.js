export function currentThread (state) {
  return state.currentThreadID
    ? state.threads[state.currentThreadID]
    : {}
}

export function currentMessages (state) {
  const thread = currentThread(state)
  return thread.messages
    ? thread.messages.map(id => state.messages[id])
    : []
}
