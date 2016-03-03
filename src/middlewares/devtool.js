const hook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

export default {
  onInit (state, store) {
    if (!hook) return
    hook.emit('vuex:init', store)
    hook.on('vuex:travel-to-state', targetState => {
      const currentState = store._vm._data
      Object.keys(targetState).forEach(key => {
        currentState[key] = targetState[key]
      })
    })
  },
  onMutation (mutation, state) {
    if (!hook) return
    hook.emit('vuex:mutation', mutation, state)
  }
}
