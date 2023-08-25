import { setupDevtoolsPlugin } from '@vue/devtools-api'
import { makeLocalGetters } from '../store-util'

const LABEL_VUEX_BINDINGS = 'vuex bindings'
const MUTATIONS_LAYER_ID = 'vuex:mutations'
const ACTIONS_LAYER_ID = 'vuex:actions'
const INSPECTOR_ID = 'vuex'

let actionId = 0

export function addDevtools (app, store) {
  setupDevtoolsPlugin(
    {
      id: 'org.vuejs.vuex',
      app,
      label: 'Vuex',
      homepage: 'https://next.vuex.vuejs.org/',
      logo: 'https://v2.vuejs.org/images/icons/favicon-96x96.png',
      packageName: 'vuex',
      componentStateTypes: [LABEL_VUEX_BINDINGS]
    },
    (api) => {
      api.addTimelineLayer({
        id: MUTATIONS_LAYER_ID,
        label: 'Vuex Mutations',
        color: COLOR_LIME_500
      })

      api.addTimelineLayer({
        id: ACTIONS_LAYER_ID,
        label: 'Vuex Actions',
        color: COLOR_LIME_500
      })

      api.addInspector({
        id: INSPECTOR_ID,
        label: 'Vuex',
        icon: 'storage',
        treeFilterPlaceholder: 'Filter stores...'
      })

      api.on.getInspectorTree((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          if (payload.filter) {
            const nodes = []
            flattenStoreForInspectorTree(nodes, store._modules.root, payload.filter, '')
            payload.rootNodes = nodes
          } else {
            payload.rootNodes = [
              formatStoreForInspectorTree(store._modules.root, '')
            ]
          }
        }
      })

      api.on.getInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const modulePath = payload.nodeId
          makeLocalGetters(store, modulePath)
          payload.state = formatStoreForInspectorState(
            getStoreModule(store._modules, modulePath),
            modulePath === 'root' ? store.getters : store._makeLocalGettersCache,
            modulePath
          )
        }
      })

      api.on.editInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const modulePath = payload.nodeId
          let path = payload.path
          if (modulePath !== 'root') {
            path = [...modulePath.split('/').filter(Boolean), ...path]
          }
          store._withCommit(() => {
            payload.set(store._state.data, path, payload.state.value)
          })
        }
      })

      store.subscribe((mutation, state) => {
        const data = {}

        if (mutation.payload) {
          data.payload = mutation.payload
        }

        data.state = state

        api.notifyComponentUpdate()
        api.sendInspectorTree(INSPECTOR_ID)
        api.sendInspectorState(INSPECTOR_ID)

        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: Date.now(),
            title: mutation.type,
            data
          }
        })
      })

      store.subscribeAction({
        before: (action, state) => {
          const data = {}
          if (action.payload) {
            data.payload = action.payload
          }
          action._id = actionId++
          action._time = Date.now()
          data.state = state

          api.addTimelineEvent({
            layerId: ACTIONS_LAYER_ID,
            event: {
              time: action._time,
              title: action.type,
              groupId: action._id,
              subtitle: 'start',
              data
            }
          })
        },
        after: (action, state) => {
          const data = {}
          const duration = Date.now() - action._time
          data.duration = {
            _custom: {
              type: 'duration',
              display: `${duration}ms`,
              tooltip: 'Action duration',
              value: duration
            }
          }
          if (action.payload) {
            data.payload = action.payload
          }
          data.state = state

          api.addTimelineEvent({
            layerId: ACTIONS_LAYER_ID,
            event: {
              time: Date.now(),
              title: action.type,
              groupId: action._id,
              subtitle: 'end',
              data
            }
          })
        }
      })
    }
  )
}

// extracted from tailwind palette
const COLOR_LIME_500 = 0x84cc16
const COLOR_DARK = 0x666666
const COLOR_WHITE = 0xffffff

const TAG_NAMESPACED = {
  label: 'namespaced',
  textColor: COLOR_WHITE,
  backgroundColor: COLOR_DARK
}

/**
 * @param {string} path
 */
function extractNameFromPath (path) {
  return path && path !== 'root' ? path.split('/').slice(-2, -1)[0] : 'Root'
}

/**
 * @param {*} module
 * @return {import('@vue/devtools-api').CustomInspectorNode}
 */
function formatStoreForInspectorTree (module, path) {
  return {
    id: path || 'root',
    // all modules end with a `/`, we want the last segment only
    // cart/ -> cart
    // nested/cart/ -> cart
    label: extractNameFromPath(path),
    tags: module.namespaced ? [TAG_NAMESPACED] : [],
    children: Object.keys(module._children).map((moduleName) =>
      formatStoreForInspectorTree(
        module._children[moduleName],
        path + moduleName + '/'
      )
    )
  }
}

/**
 * @param {import('@vue/devtools-api').CustomInspectorNode[]} result
 * @param {*} module
 * @param {string} filter
 * @param {string} path
 */
function flattenStoreForInspectorTree (result, module, filter, path) {
  if (path.includes(filter)) {
    result.push({
      id: path || 'root',
      label: path.endsWith('/') ? path.slice(0, path.length - 1) : path || 'Root',
      tags: module.namespaced ? [TAG_NAMESPACED] : []
    })
  }
  Object.keys(module._children).forEach(moduleName => {
    flattenStoreForInspectorTree(result, module._children[moduleName], filter, path + moduleName + '/')
  })
}

/**
 * @param {*} module
 * @return {import('@vue/devtools-api').CustomInspectorState}
 */
function formatStoreForInspectorState (module, getters, path) {
  getters = path === 'root' ? getters : getters[path]
  const gettersKeys = Object.keys(getters)
  const storeState = {
    state: Object.keys(module.state).map((key) => ({
      key,
      editable: true,
      value: module.state[key]
    }))
  }

  if (gettersKeys.length) {
    const tree = transformPathsToObjectTree(getters)
    storeState.getters = Object.keys(tree).map((key) => ({
      key: key.endsWith('/') ? extractNameFromPath(key) : key,
      editable: false,
      value: canThrow(() => tree[key])
    }))
  }

  return storeState
}

function transformPathsToObjectTree (getters) {
  const result = {}
  Object.keys(getters).forEach(key => {
    const path = key.split('/')
    if (path.length > 1) {
      let target = result
      const leafKey = path.pop()
      path.forEach((p) => {
        if (!target[p]) {
          target[p] = {
            _custom: {
              value: {},
              display: p,
              tooltip: 'Module',
              abstract: true
            }
          }
        }
        target = target[p]._custom.value
      })
      target[leafKey] = canThrow(() => getters[key])
    } else {
      result[key] = canThrow(() => getters[key])
    }
  })
  return result
}

function getStoreModule (moduleMap, path) {
  const names = path.split('/').filter((n) => n)
  return names.reduce(
    (module, moduleName, i) => {
      const child = module[moduleName]
      if (!child) {
        throw new Error(`Missing module "${moduleName}" for path "${path}".`)
      }
      return i === names.length - 1 ? child : child._children
    },
    path === 'root' ? moduleMap : moduleMap.root._children
  )
}

function canThrow (cb) {
  try {
    return cb()
  } catch (e) {
    return e
  }
}
