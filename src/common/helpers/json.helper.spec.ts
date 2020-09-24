import { JsonHelper } from './json.helper'

describe('Validation json helper', () => {
  it('should be defined', () => {
    expect(JsonHelper).toBeDefined()
  })

  it('should be convert to array correct', () => {
    const mockFromJsonFunction = jest.fn()
    const list = [{ nome: 'vini' }, { nome: 'bina' }]
    JsonHelper.jsonToArray(list, mockFromJsonFunction)
    expect(mockFromJsonFunction).toBeCalledTimes(2)
    expect(mockFromJsonFunction).toHaveBeenLastCalledWith({ nome: 'bina' })
  })
})
