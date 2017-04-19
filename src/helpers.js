export const mapState = normalizeNamespace((namespace, states) => {
  const res = {}
  normalizeMap(states).forEach(({ key, val }) => {
    res[key] = function mappedState () {
      let state = this.$store.state
      let getters = this.$store.getters
      let ns = namespace(this);
      if (ns) {
        const module = getModuleByNamespace(this.$store, 'mapState', ns)
        if (!module) {
          return
        }
        state = module.context.state
        getters = module.context.getters
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})

export const mapMutations = normalizeNamespace((namespace, mutations) => {
  const res = {}
  normalizeMap(mutations).forEach(({ key, val }) => {
    res[key] = function mappedMutation (...args) {
      let ns = namespace(this);
      let nval = ns + val;
      if (ns && !getModuleByNamespace(this.$store, 'mapMutations', ns)) {
        return
      }
      return this.$store.commit.apply(this.$store, [nval].concat(args))
    }
  })
  return res
})

export const mapGetters = normalizeNamespace((namespace, getters) => {
  const res = {}
  normalizeMap(getters).forEach(({ key, val }) => {
    res[key] = function mappedGetter () {
      let ns = namespace(this);
      let nval = ns + val;
      if (ns && !getModuleByNamespace(this.$store, 'mapGetters', ns)) {
        return
      }
      if (!(nval in this.$store.getters)) {
        console.error(`[vuex] unknown getter: ${nval}`)
        return
      }
      return this.$store.getters[nval]
    }
    // mark vuex getter for devtools
    res[key].vuex = true
  })
  return res
})

export const mapActions = normalizeNamespace((namespace, actions) => {
  const res = {}
  normalizeMap(actions).forEach(({ key, val }) => {
    res[key] = function mappedAction (...args) {
      let ns = namespace(this);
      let nval = ns + val;
      if (ns && !getModuleByNamespace(this.$store, 'mapActions', ns)) {
        return
      }
      return this.$store.dispatch.apply(this.$store, [nval].concat(args))
    }
  })
  return res
})

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(key => ({ key, val: key }))
    : Object.keys(map).map(key => ({ key, val: map[key] }))
}

function normalizeNamespace (fn) {
  return (namespace, map) => {
    if(typeof namespace === 'function'){
      return fn((vm) => {
        let ns = namespace(vm);
        if (ns && ns.charAt(ns.length - 1) !== '/') {
            ns += '/';
        }
        return ns;
      }, map);
    } else if (typeof namespace !== 'string') {
      map = namespace
      namespace = ''
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    return fn(() => namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  const module = store._modulesNamespaceMap[namespace]
  if (!module) {
    console.error(`[vuex] module namespace not found in ${helper}(): ${namespace}`)
  }
  return module
}
