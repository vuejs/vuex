import ModuleCollection from '../../../src/module/module-collection'

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

  it('getNamespacer', () => {
    const module = (namespace, children) => {
      return {
        namespace,
        modules: children
      }
    }
    const collection = new ModuleCollection({
      namespace: 'ignore/', // root module namespace should be ignored
      modules: {
        a: module('a/', {
          b: module(null, {
            c: module('c/')
          }),
          d: module('d/'),
          e: module((type, category) => {
            return category + '-e/' + type
          }, {
            f: module('f/')
          })
        })
      }
    })
    const check = (path, expected) => {
      const type = 'test'
      const category = 'getter'
      const namespacer = collection.getNamespacer(path)
      expect(namespacer(type, category)).toBe(expected)
    }
    check(['a'], 'a/test')
    check(['a', 'b'], 'a/test')
    check(['a', 'b', 'c'], 'a/c/test')
    check(['a', 'd'], 'a/d/test')
    check(['a', 'e'], `a/getter-e/test`)
    check(['a', 'e', 'f'], `a/getter-e/f/test`)
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
})
