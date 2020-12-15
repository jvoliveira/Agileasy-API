import { UtilsHelper } from './utils.helper'

describe('Validation json helper', () => {
  it('should be defined', () => {
    expect(UtilsHelper).toBeDefined()
  })

  it('should be convert to array correct', () => {
    const a = [1, 2, 3, 4, 5, 6]
    const b = UtilsHelper.shuffle([...a])
    expect(a.length).toBe(b.length)
    expect(a.every(value => b.includes(value))).toBe(true)
  })
})
