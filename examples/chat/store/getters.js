export const threads = state => state.threads

export const currentThread = state => {
  return state.currentThreadID
    ? state.threads[state.currentThreadID]
    : {}
}

export const currentMessages = state => {
  const thread = currentThread(state)
  return thread.messages
    ? thread.messages.map(id => state.messages[id])
    : []
}

export const unreadCount = state => {
  const { threads } = state
  return Object.keys(threads).reduce((count, id) => {
    return threads[id].lastMessage.isRead ? count : count + 1
  }, 0)
}

export const sortedMessages = state => {
  const messages = currentMessages(state)
  return messages.slice().sort((a, b) => a.timestamp - b.timestamp)
}
