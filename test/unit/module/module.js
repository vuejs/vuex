import Module from '../../../src/module/module'

describe('Module', () => {
  it('get hasNamespace', () => {
    let module = new Module({})
    expect(module.hasNamespace).toBe(false)

    module = new Module({ namespace: '' })
    expect(module.hasNamespace).toBe(false)

    module = new Module({ namespace: 'prefix/' })
    expect(module.hasNamespace).toBe(true)

    module = new Module({ namespace: () => {} })
    expect(module.hasNamespace).toBe(true)
  })

  it('get namespacer: no namespace option', () => {
    const module = new Module({})
    expect(module.namespacer('test', 'getter')).toBe('test')
  })

  it('get namespacer: namespace option is string value', () => {
    const module = new Module({
      namespace: 'prefix/'
    })
    expect(module.namespacer('test', 'getter')).toBe('prefix/test')
  })

  it('get namespacer: namespace option is function value', () => {
    const module = new Module({
      namespace (type, category) {
        return category + '/' + type
      }
    })
    expect(module.namespacer('test', 'getter')).toBe('getter/test')
  })
})
