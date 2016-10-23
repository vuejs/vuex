import Module from '../../../src/module/module'

describe('Module', () => {
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
