const devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__

export default function devtoolPlugin (store) {
  if (!devtoolHook) return

  store._devtoolHook = devtoolHook
  // buffer mutations for devtools
  // it will later be removed by devtools
  if (devtoolHook.supportsVuexBuffer) {
    store._devtoolBuffer = []
  }

  devtoolHook.emit('vuex:init', store)

  devtoolHook.on('vuex:travel-to-state', targetState => {
    store.replaceState(targetState)
  })

  store.subscribe((mutation, state) => {
    devtoolHook.emit('vuex:mutation', mutation, state)

    // if buffer exists push mutation for later use
    if (Array.isArray(store._devtoolBuffer)) {
      store._devtoolBuffer.push(mutation)
    }
  })
}
