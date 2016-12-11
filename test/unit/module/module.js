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
    expect(module.namespace).toBe('')
  })

  it('get namespacer: namespace option is string value', () => {
    const module = new Module({
      namespace: 'prefix/'
    })
    expect(module.namespace).toBe('prefix/')
  })
})
