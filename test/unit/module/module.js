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
    const module = new Module({
      namespaced: true
    })
    expect(module.namespaced).toBe(true)
  })
})
