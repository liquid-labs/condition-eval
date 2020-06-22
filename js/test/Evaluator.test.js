/* globals describe expect test */

import { Evaluator } from '..'

describe('Evaluator.evalTruth', () => {
  test.each`
  desc | expression | parameters | result
  ${'trivial false'} | ${'0'} | ${{}} | ${false}
  ${'trivial false'} | ${'false'} | ${{}} | ${false}
  ${'trivial true'} | ${'1'} | ${{}} | ${true}
  ${'trivial true'} | ${'true'} | ${{}} | ${true}
  ${'extraneous parameters'} | ${'true'} | ${{ blah: 0 }} | ${true}
  ${'simple parameter sub'} | ${'FOO'} | ${{ FOO: 1 }} | ${true}
  ${'complex expression'} | ${'BAR || (FOO && 1)'} | ${{ BAR: 'false', FOO: 1 }} | ${true}
  `("$desc; '$expression' with conditions '$parameters' -> $result'", ({ desc, expression, parameters, result }) => {
    const evaluator = new Evaluator({parameters: parameters})
    expect(evaluator.evalTruth(expression)).toBe(result)
  })

  test('falls back to process.env for substitution', () => {
    process.env.FOO = 'true'
    const evaluator = new Evaluator({parameters: { BAR: 'false' }})
    expect(evaluator.evalTruth('BAR || FOO')).toBe(true)
  })

  test.each`
  input
  ${0}
  ${false}
  ${1}
  ${true}
  `("rejects non-string input '$input'", ({ input }) => {
    const evaluator = new Evaluator()
    expect(() => evaluator.evalTruth(input)).toThrow(/^Expression must be a string./)
  })
})
