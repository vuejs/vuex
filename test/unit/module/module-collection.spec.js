import ModuleCollection from '../../../src/module/module-collection'
import { assertRawModule, updateModule, makeAssertionMessage } from '../../../src/module/module-collection'

describe('ModuleCollection', () => {
  it('get', () => {
    const collection = new ModuleCollection({
      state: { value: 1 },
      modules: {
        a: {
          state: { value: 2 }
        },
        b: {
          state: { value: 3 },
          modules: {
            c: {
              state: { value: 4 }
            }
          }
        }
      }
    })
    expect(collection.get([]).state.value).toBe(1)
    expect(collection.get(['a']).state.value).toBe(2)
    expect(collection.get(['b']).state.value).toBe(3)
    expect(collection.get(['b', 'c']).state.value).toBe(4)
  })

  it('getNamespace', () => {
    const module = (namespaced, children) => {
      return {
        namespaced,
        modules: children
      }
    }
    const collection = new ModuleCollection({
      namespace: 'ignore/', // root module namespace should be ignored
      modules: {
        a: module(true, {
          b: module(false, {
            c: module(true)
          }),
          d: module(true)
        })
      }
    })
    const check = (path, expected) => {
      const type = 'test'
      const namespace = collection.getNamespace(path)
      expect(namespace + type).toBe(expected)
    }
    check(['a'], 'a/test')
    check(['a', 'b'], 'a/test')
    check(['a', 'b', 'c'], 'a/c/test')
    check(['a', 'd'], 'a/d/test')
  })

  it('register', () => {
    const collection = new ModuleCollection({})
    collection.register(['a'], {
      state: { value: 1 }
    })
    collection.register(['b'], {
      state: { value: 2 }
    })
    collection.register(['a', 'b'], {
      state: { value: 3 }
    })

    expect(collection.get(['a']).state.value).toBe(1)
    expect(collection.get(['b']).state.value).toBe(2)
    expect(collection.get(['a', 'b']).state.value).toBe(3)
  })

  it('unregister', () => {
    const collection = new ModuleCollection({})
    collection.register(['a'], {
      state: { value: true }
    })
    expect(collection.get(['a']).state.value).toBe(true)

    expect(collection.unregister(['a'])).toBe(true)
    expect(collection.get(['a'])).toBe(undefined)
  })

  it('does not unregister initial modules', () => {
    const collection = new ModuleCollection({
      modules: {
        a: {
          state: { value: true }
        }
      }
    })
    expect(collection.unregister(['a'])).toBe(false)
    expect(collection.get(['a']).state.value).toBe(true)
  })

  it('updateModule: without modules', () => {
    const collection = new ModuleCollection({
      state: {
        name: 'vuex',
        age: '2'
      },
      modules: {
        item1: { name: 'item1', getters: {}},
        item2: { name: 'item2', getters: {}},
        item3: { name: 'item3', getters: {}}
      },
      getters: {},
      mutations: {}
    })

    updateModule([], collection.root, {
      state: {
        name: 'vuex',
        age: '3'
      },
      getters: {
        getter1: () => {},
        getter2: () => {}
      },
      mutations: {
        mutation1: () => {}
      }
    })

    // only effect getters, mutations and namespaced
    expect(collection.root.state).toEqual({ name: 'vuex', age: '2' })
    expect(typeof collection.root._rawModule.getters.getter1).toBe('function')
    expect(typeof collection.root._rawModule.getters.getter2).toBe('function')
    expect(typeof collection.root._rawModule.mutations.mutation1).toBe('function')
  })

  it('updateModule: with modules', () => {
    const collection = new ModuleCollection({
      state: {
        name: 'vuex',
        age: '2'
      },
      modules: {
        item1: { name: 'item1', getters: {}},
        item2: { name: 'item2', getters: {}},
        item3: { name: 'item3', getters: {}}
      },
      getters: {},
      mutations: {}
    })

    updateModule([], collection.root, {
      name: 'item1.x',
      getters: {
        getter1: () => {},
        getter2: () => {}
      },
      mutations: {
        mutation1: () => {}
      },
      modules: {
        item1: { name: 'item1', getters: {
          getter1: () => {},
          getter2: () => {}
        }}
      }
    })

    const item = collection.root._children['item1']

    expect(item._rawModule.name).toEqual('item1')
    expect(typeof item._rawModule.getters.getter1).toBe('function')
    expect(typeof item._rawModule.getters.getter2).toBe('function')
    expect(typeof item._rawModule.mutations).toBe('undefined')
  })

  it('makeAssertionMessage', () => {
    let message = makeAssertionMessage(['a', 'b', 'c'], 'getters', 'order', { a: 1 }, 'function')
    expect(message).toBe('getters should be function but "getters.order" in module "a.b.c" is {"a":1}.')

    message = makeAssertionMessage(['a', 'b', 'c'], 'getters', 'order', { a: 1 }, 'string')
    expect(message).toBe('getters should be string but "getters.order" in module "a.b.c" is {"a":1}.')
  })

  it('assertRawModule: get exceptions', () => {
    let rawModule = {
      getters: {
        getter1: () => {},
        getter2: 'cool'
      }
    }

    expect(assertRawModule.bind(null, ['a', 'bc'], rawModule)).toThrow(new Error('[vuex] getters should be function but "getters.getter2" in module "a.bc" is "cool".'))

    rawModule = {
      mutations: {
        mutation1: () => {},
        mutation2: {}
      }
    }

    expect(assertRawModule.bind(null, ['a', 'c'], rawModule)).toThrow(new Error('[vuex] mutations should be function but "mutations.mutation2" in module "a.c" is {}.'))

    rawModule = {
      actions: {
        action1: {},
        action2: () => {}
      }
    }

    expect(assertRawModule.bind(null, ['a', 'b'], rawModule)).toThrow(new Error('[vuex] actions should be function or object with "handler" function but "actions.action1" in module "a.b" is {}.'))
  })

  it('assertRawModule: run successful', () => {
    const rawModule = {
      actions: {
        action1: {
          handler: () => {}
        },
        action2: () => {}
      },
      mutations: {
        mutation1: () => {}
      },
      getters: {
        getter1: () => {}
      }
    }

    // Run successful
    expect(assertRawModule.bind(null, ['a', 'b'], rawModule).call()).toBe(undefined)
  })
})
