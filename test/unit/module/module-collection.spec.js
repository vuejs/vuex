import ModuleCollection from '@/module/module-collection'

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

    collection.unregister(['a'])
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
    collection.unregister(['a'])
    expect(collection.get(['a']).state.value).toBe(true)
  })

  it('warns when unregistering non existing module', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation()

    const collection = new ModuleCollection({})
    collection.unregister(['a'])
    expect(spy).toHaveBeenCalled()
  })

  it('isRegistered', () => {
    const collection = new ModuleCollection({})
    collection.register(['a'], {
      state: { value: true }
    })
    collection.register(['a', 'b'], {
      state: { value: false }
    })
    expect(collection.isRegistered(['a'])).toBe(true)
    expect(collection.isRegistered(['a', 'b'])).toBe(true)
    expect(collection.isRegistered(['c'])).toBe(false)
    expect(collection.isRegistered(['c', 'd'])).toBe(false)
  })
})
