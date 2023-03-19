/* globals describe expect test */

import { Evaluator } from '..'
import { booleans, severities } from '../constants'

describe('Evaluator.evalTruth', () => {
  test.each`
  desc | expression | parameters | result
  ${'trivial false'} | ${'0'} | ${{}} | ${false}
  ${'trivial false'} | ${'false'} | ${{}} | ${false}
  ${'trivial true'} | ${'1'} | ${{}} | ${true}
  ${'trivial true'} | ${'true'} | ${{}} | ${true}
  ${'extraneous parameters'} | ${'true'} | ${{ blah : 0 }} | ${true}
  ${'simple parameter sub'} | ${'FOO'} | ${{ FOO : 1 }} | ${true}
  // This was failing at one point; not sure why
  ${'simple parameter sub - unkown bug check'} | ${'BUSINESS'} | ${{ BUSINESS : 1 }} | ${true}
  ${'simple parameter sub - single char'} | ${'B'} | ${{ B : 1 }} | ${true}
  ${'complex expression'} | ${'BAR || (FOO && 1)'} | ${{ BAR : 'false', FOO : 1 }} | ${true}
  ${'simple math'}| ${'2 + BAR - FOO == 3'} | ${{ BAR : 4, FOO : 3 }} | ${true}
  ${'complex math'}| ${'(BAR % 2 == 0) && (FOO * 3 != 6)'} | ${{ BAR : 4, FOO : 3 }} | ${true}
  ${'not expression'} | ${'!BAR'} | ${{ BAR : 1 }} | ${false}
  ${'complex not expression'} | ${'FOO && !BAR'} | ${{ FOO : 1, BAR : false }} | ${true}
  ${'greater than'} | ${'2 > 1'} | ${{}} | ${true}
  ${'less than'} | ${'1 < 2'} | ${{}} | ${true}
  ${'greater than equal to'} | ${'2 >= 1'} | ${{}} | ${true}
  ${'less than equal to'} | ${'1 <= 2'} | ${{}} | ${true}
  `("$desc; '$expression' with conditions '$parameters' -> $result'", ({ desc, expression, parameters, result }) => {
    const evaluator = new Evaluator({ parameters : parameters })
    expect(evaluator.evalTruth(expression)).toBe(result)
  })

  test('falls back to process.env for substitution', () => {
    process.env.FOO = 'true'
    const evaluator = new Evaluator({ parameters : { BAR : 'false' } })
    expect(evaluator.evalTruth('BAR || FOO')).toBe(true)
  })

  test('utilizes zeroRes', () => {
    const evaluator = new Evaluator({ zeroRes : [/^.+_ZERO_PARAM/] })
    expect(evaluator.evalTruth('SOME_ZERO_PARAM')).toBe(false)
  })

  test.each`
  param
  ${'TRUTHY'}
  ${'FALSISH'}
  ${'UNKNOWN'}
  `("rejects unknown parameter '$param'", ({ param }) => {
    const evaluator = new Evaluator()
    const expression = `true || ${param}`
    expect(() => evaluator.evalTruth(expression)).toThrow(new RegExp(`^Condition parameter '${param}' is not defined.`))
  })

  test.each`
  expression
  ${'someFunc()'}
  ${'~1'}
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

  describe('standard constants', () => {
    const standards = Object.assign({}, booleans, severities)

    test.each(Object.keys(standards))(`Recognizes standard constant '%s'`, (key) => {
      const evaluator = new Evaluator()
      expect(evaluator.evalNumber(key)).toEqual(standards[key])
    })

    test.each([
      ['Can exclude booleans', { excludeBooleans : true }, { booleans : false, severities : true }],
      ['Can exclude severities', { excludeSeverities : true }, { booleans : true, severities : false }],
      ['Can exclude booleans and severities', { excludeBooleans : true, excludeSeverities : true }, { booleans : false, severities : false }],
      ['Can exclude all stanadrds', { excludeStandards : true }, { booleans : false, severities : false }]
    ])('%s (%p)', (desc, settings, expectations) => {
      const evaluator = new Evaluator(settings)
      for (const key of Object.keys(booleans)) {
        expectations.booleans
          ? expect(evaluator.evalNumber(key)).toEqual(standards[key])
          : expect(() => evaluator.evalNumber(key)).toThrow()
      }
      for (const key of Object.keys(severities)) {
        expectations.severities
          ? expect(evaluator.evalNumber(key)).toEqual(standards[key])
          : expect(() => evaluator.evalNumber(key)).toThrow()
      }
    })
  })
})
