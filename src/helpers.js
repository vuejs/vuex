export function mapGetters (getters) {
  const res = {}
  normalizeMap(getters).forEach(({ key, val }) => {
    res[key] = function mappedGetter () {
      if (!(val in this.$store.getters)) {
        console.error(`[vuex] unknown getter: ${val}`)
      }
      return this.$store.getters[val]
    }
  })
  return res
}

export function mapActions (actions) {
  const res = {}
  normalizeMap(actions).forEach(({ key, val }) => {
    res[key] = function mappedAction (...args) {
      return this.$store.dispatch(val, ...args)
    }
  })
  return res
}

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}
