export default store => {
  const Watcher = getWatcher(store._vm)
  store._vm.watch('state', () => {
    if (!store._dispatching) {
      throw new Error(
        '[vuex] Do not mutate vuex store state outside mutation handlers.'
      )
    }
  }, { deep: true, sync: true })
}
