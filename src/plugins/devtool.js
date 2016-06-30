const hook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

export default function devtoolPlugin (store) {
  if (!hook) return

  hook.emit('vuex:init', store)

  hook.on('vuex:travel-to-state', targetState => {
    store._dispatching = true
    store._vm.state = targetState
    store._dispatching = false
  })

  store.on('mutation', (mutation, state) => {
    hook.emit('vuex:mutation', mutation, state)
  })
}
