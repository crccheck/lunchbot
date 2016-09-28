import { expect } from 'chai'
import { formatText } from '../src/slack'

describe('formatTest', () => {
  it('trivial case', () => {
    const trivialOutput = formatText({ _meta: { total: 0 } })
    expect(trivialOutput).to.deep.equal([])
  })
})
