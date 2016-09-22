import { expect } from 'chai'
import { deepCopy } from '../../src/util'

describe('util', () => {
  it('deepCopy: nornal structure', () => {
    const original = {
      a: 1,
      b: 'string',
      c: true,
      d: null,
      e: undefined
    }
    const copy = deepCopy(original)

    expect(copy).to.deep.equal(original)
  })

  it('deepCopy: nested structure', () => {
    const original = {
      a: {
        b: 1,
        c: [2, 3, {
          d: 4
        }]
      }
    }
    const copy = deepCopy(original)

    expect(copy).to.deep.equal(original)
  })

  it('deepCopy: circular structure', () => {
    const original = {
      a: 1
    }
    original.circular = original

    const copy = deepCopy(original)

    expect(copy).to.deep.equal(original)
  })
})
