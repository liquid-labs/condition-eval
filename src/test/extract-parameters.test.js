/* global describe expect test */
import { extractParameters } from '../extract-parameters'

describe('extractParameters', () => {
  test.each([
    ['PARAM1', ['PARAM1']],
    ['PARAM1 || PARAM2', ['PARAM1', 'PARAM2']],
    ['(FOO + BAR)*FOO', ['FOO', 'BAR']],
    ['(FOO + BAR - 100) * FOO/BAZ', ['FOO', 'BAR', 'BAZ']],
    ['(foo + bar - 100) * FOO/baz', ['FOO']],
    ['(1 + 2 - 100) * 3/2', []],
    ['(true || false) && FOO', ['FOO']],
    ['(true || false) && true', []]
  ])('expression %s has params %p', (expression, expectedParams) =>
    expect(extractParameters({ expression })).toEqual(expectedParams))
})