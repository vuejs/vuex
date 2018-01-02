import Module from '../../../src/module/module'

describe('Module', () => {
  it('get state', () => {
    const module = new Module({
      state: {
        value: true
      }
    })
    expect(module.state).toEqual({ value: true })
  })

  it('get state: should return object if state option is empty', () => {
    const module = new Module({})
    expect(module.state).toEqual({})
  })

  it('get namespacer: no namespace option', () => {
    const module = new Module({})
    expect(module.namespaced).toBe(false)
  })

  it('get namespacer: namespace option is true', () => {
    let module = new Module({
      namespaced: true
    })
    expect(module.namespaced).toBe(true)

    module = new Module({
      namespaced: 100
    })
    expect(module.namespaced).toBe(true)
  })

  it('add child method', () => {
    const module = new Module({})

    module.addChild('v1', new Module({}))
    module.addChild('v2', new Module({}))
    expect(Object.keys(module._children)).toEqual(['v1', 'v2'])
  })

  it('remove child method', () => {
    const module = new Module({})

    module.addChild('v1', new Module({}))
    module.addChild('v2', new Module({}))
    module.removeChild('v2')
    module.removeChild('abc')
    expect(Object.keys(module._children)).toEqual(['v1'])
  })

  it('get child method', () => {
    const module = new Module({})

    const subModule1 = new Module({ state: { name: 'v1' }})
    const subModule2 = new Module({ state: { name: 'v2' }})
    module.addChild('v1', subModule1)
    module.addChild('v2', subModule2)
    expect(module.getChild('v2')).toEqual(subModule2)
    expect(module.getChild('v1')).toEqual(subModule1)
  })

  it('update method', () => {
    const originObject = {
      state: {
        name: 'vuex',
        version: '2.x.x'
      },
      namespaced: true,
      actions: {
        a1: () => {},
        a2: () => {}
      },
      mutations: {
        m1: () => {},
        m2: () => {}
      },
      getters: {
        g1: () => {},
        g2: () => {}
      }
    }
    const newObject = {
      actions: {
        a3: () => {},
        a4: () => {}
      },
      mutations: {
        m3: () => {},
        m2: () => {}
      },
      getters: {
        g1: () => {}
      },
      namespaced: false,
      state: {
        name: 'vuex',
        version: '3.x.x'
      }
    }
    const module = new Module(originObject)

    expect(module._rawModule).toEqual(originObject)

    module.update(newObject)
    expect(module._rawModule).not.toEqual(newObject)
    expect(module._rawModule.actions).toEqual(newObject.actions)
    expect(module._rawModule.mutations).toEqual(newObject.mutations)
    expect(module._rawModule.getters).toEqual(newObject.getters)
    expect(module._rawModule.namespaced).toEqual(newObject.namespaced)
    expect(module._rawModule.state).toEqual(originObject.state)
  })

  it('forEachChild method', () => {
    const module = new Module({})
    const module1 = new Module({})
    const module2 = new Module({})

    module.addChild('v1', module1)
    module.addChild('v2', module2)

    const collections = []
    module.forEachChild((item) => { collections.push(item) })
    expect(collections.length).toEqual(2)
    expect(collections).toEqual([module2, module1])
  })

  it('forEachAction method', () => {
    const action1 = () => {}
    const action2 = () => {}

    const module = new Module({
      actions: {
        action1, action2
      }
    })

    const collections = []
    module.forEachAction((item) => { collections.push(item) })
    expect(collections.length).toEqual(2)
    expect(collections).toEqual([action1, action2])
  })

  it('forEachGetter method', () => {
    const getter1 = () => {}
    const getter2 = () => {}

    const module = new Module({
      getters: {
        getter1, getter2
      }
    })

    const collections = []
    module.forEachGetter((item) => { collections.push(item) })
    expect(collections.length).toEqual(2)
    expect(collections).toEqual([getter1, getter2])
  })

  it('forEachMutation method', () => {
    const mutation1 = () => {}
    const mutation2 = () => {}

    const module = new Module({
      mutations: {
        mutation1, mutation2
      }
    })

    const collections = []
    module.forEachMutation((item) => { collections.push(item) })
    expect(collections.length).toEqual(2)
    expect(collections).toEqual([mutation1, mutation2])
  })
})
