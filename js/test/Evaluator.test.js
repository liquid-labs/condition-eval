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
  ${'simple math'}| ${'2 + BAR - FOO == 3'} | ${{ BAR: 4, FOO: 3 }} | ${true}
  ${'complex math'}| ${'(BAR % 2 == 0) && (FOO * 3 != 6)'} | ${{ BAR: 4, FOO: 3 }} | ${true}
  `("$desc; '$expression' with conditions '$parameters' -> $result'", ({ desc, expression, parameters, result }) => {
    const evaluator = new Evaluator({parameters: parameters})
    expect(evaluator.evalTruth(expression)).toBe(result)
  })

  test('falls back to process.env for substitution', () => {
    process.env.FOO = 'true'
    const evaluator = new Evaluator({parameters: { BAR: 'false' }})
    expect(evaluator.evalTruth('BAR || FOO')).toBe(true)
  })

  test('utilizes zeroRes', () => {
    const evaluator = new Evaluator({zeroRes: [/^.+_ZERO_PARAM/]})
    expect(evaluator.evalTruth('SOME_ZERO_PARAM')).toBe(false)
  })

  test.each`
  param
  ${'TRUE'}
  ${'FALSE'}
  ${'UNKNOWN'}
  `("rejects unknown parameter '$param'", ({param}) => {
    const evaluator = new Evaluator()
    const expression = `true || ${param}`
    expect(() => evaluator.evalTruth(expression)).toThrow(new RegExp(`^Condition parameter '${param}' is not defined.`))
  })

  test.each`
  expression
  ${'someFunc()'}
  `("rejects unsafe expression '$expression'", ({ expression }) => {
    const evaluator = new Evaluator()
    expect(() => evaluator.evalTruth(expression)).toThrow(/Invalid expression/)
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
