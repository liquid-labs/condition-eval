/* globals describe expect test */

import { Evaluator } from '..'
import { booleans, severities } from '../constants'

describe('Evaluator', () => {
  describe('expression processing', () => {
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
      expect(() => evaluator.evalTruth(expression)).toThrow(
        new RegExp(`^Condition parameter '${param}' is not defined.`)
      )
    })

    // this is also tested directly in 'verify-expression-safe.test.js'
    test.each`
      expression
      ${'someFunc()'}
      ${'@1'}
      ${'foo.bar()'}
      ${'foo.bar("hi")'}
      ${'foo.bar(1)'}
      ${'foo.bar(baz)'}
      ${'foo.bar ()'}
      ${'foo.bar ("hi")'}
      ${'foo.bar (1)'}
      ${'foo.bar (baz)'}
    `("rejects unsafe expression '$expression'", ({ expression }) => {
      const evaluator = new Evaluator()
      expect(() => evaluator.evalTruth(expression)).toThrow(
        /Invalid expression/
      )
    })

    test.each`
      input
      ${0}
      ${false}
      ${1}
      ${true}
    `("rejects non-string input '$input'", ({ input }) => {
      const evaluator = new Evaluator()
      expect(() => evaluator.evalTruth(input)).toThrow(
        /^Expression must be a string./
      )
    })
  })

  describe('evalTruth', () => {
    test.each`
      desc                                                | expression                            | parameters                                             | result
      ${'trivial false'}                                  | ${'0'}                                | ${{}}                                                  | ${false}
      ${'trivial false'}                                  | ${'false'}                            | ${{}}                                                  | ${false}
      ${'trivial true'}                                   | ${'1'}                                | ${{}}                                                  | ${true}
      ${'trivial true'}                                   | ${'true'}                             | ${{}}                                                  | ${true}
      ${'extraneous parameters'}                          | ${'true'}                             | ${{ blah : 0 }}                                         | ${true}
      ${'simple parameter sub'}                           | ${'FOO'}                              | ${{ FOO : 1 }}                                          | ${true}
      ${'simple parameter sub - unkown bug check'}        | ${'BUSINESS'}                         | ${{ BUSINESS : 1 }}                                     | ${true}
      ${'simple parameter sub - single char'}             | ${'B'}                                | ${{ B : 1 }}                                            | ${true}
      ${'complex expression'}                             | ${'BAR || (FOO && 1)'}                | ${{ BAR : 'false', FOO : 1 }}                            | ${true}
      ${'simple math'}                                    | ${'2 + BAR - FOO == 3'}               | ${{ BAR : 4, FOO : 3 }}                                  | ${true}
      ${'complex math'}                                   | ${'(BAR % 2 == 0) && (FOO * 3 != 6)'} | ${{ BAR : 4, FOO : 3 }}                                  | ${true}
      ${'not expression'}                                 | ${'!BAR'}                             | ${{ BAR : 1 }}                                          | ${false}
      ${'complex not expression'}                         | ${'FOO && !BAR'}                      | ${{ FOO : 1, BAR : false }}                              | ${true}
      ${'greater than'}                                   | ${'2 > 1'}                            | ${{}}                                                  | ${true}
      ${'less than'}                                      | ${'1<2'}                              | ${{}}                                                  | ${true}
      ${'greater than equal to'}                          | ${'2 >= 1'}                           | ${{}}                                                  | ${true}
      ${'less than equal to'}                             | ${'1 <= 2'}                           | ${{}}                                                  | ${true}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'true' }}                                     | ${true}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 't' }}                                        | ${true}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'yes' }}                                      | ${true}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'y' }}                                        | ${true}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'True' }}                                     | ${true}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'T' }}                                        | ${true}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'Yes' }}                                      | ${true}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'Y' }}                                        | ${true}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'false' }}                                    | ${false}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'f' }}                                        | ${false}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'no' }}                                       | ${false}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'N' }}                                        | ${false}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'False' }}                                    | ${false}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'F' }}                                        | ${false}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'No' }}                                       | ${false}
      ${'converts truthy parameters'}                     | ${'FOO'}                              | ${{ FOO : 'N' }}                                        | ${false}
      ${'converts empty strings to false'}                | ${'FOO'}                              | ${{ FOO : '' }}                                         | ${false}
      ${'converts non-empty+non-special strings to true'} | ${'FOO'}                              | ${{ FOO : 'hi!' }}                                      | ${true}
      ${'transaltes simple nested values'}                | ${'some.path.VAR'}                    | ${{ some : { path : { VAR : true } } }}                   | ${true}
      ${'complex expression with nested values'}          | ${'bar.BAR || (FOO && 1)'}            | ${{ bar : { BAR : 'false' }, FOO : 1 }}                   | ${true}
      ${'complex expression with multiple nested values'} | ${'bar.baz.BAR || (foo.FOO && 1)'}    | ${{ bar : { baz : { BAR : 'false' } }, foo : { FOO : 1 } }} | ${true}
    `(
      "$desc; eval of '$expression' with conditions '$parameters' -> $result'",
      ({ expression, parameters, result }) => {
        const evaluator = new Evaluator({ parameters })
        expect(evaluator.evalTruth(expression)).toBe(result)
      }
    )
  })

  describe('evalNumber', () => {
    test.each`
      desc                                           | expression                                                                                               | parameters                    | result
      ${'trivial 0'}                                 | ${'0'}                                                                                                   | ${{}}                         | ${0}
      ${'trivial 23'}                                | ${'23'}                                                                                                  | ${{}}                         | ${23}
      ${'trivial -23'}                               | ${'-23'}                                                                                                 | ${{}}                         | ${-23}
      ${'trivial 1.5'}                               | ${'1.5'}                                                                                                 | ${{}}                         | ${1.5}
      ${'extraneous parameters'}                     | ${'18'}                                                                                                  | ${{ blah : 0 }}                | ${18}
      ${'simple parameter sub'}                      | ${'FOO'}                                                                                                 | ${{ FOO : 1 }}                 | ${1}
      ${'simple parameter sub (float)'}              | ${'FOO'}                                                                                                 | ${{ FOO : 1.25 }}              | ${1.25}
      ${'complex expression'}                        | ${'BAR || (FOO + 1)'}                                                                                    | ${{ BAR : 'false', FOO : 1 }}   | ${2}
      ${'complex expression (float)'}                | ${'BAR || (FOO + 1.8)'}                                                                                  | ${{ BAR : 'false', FOO : 0.2 }} | ${2}
      ${'simple math'}                               | ${'2 + BAR - FOO'}                                                                                       | ${{ BAR : 4, FOO : 3 }}         | ${3}
      ${'simple math (float)'}                       | ${'2.0 + BAR - FOO'}                                                                                     | ${{ BAR : 4.1, FOO : 3.1 }}     | ${3}
      ${'complex math'}                              | ${'(BAR % 2) - (FOO * 3)'}                                                                               | ${{ BAR : 4, FOO : 3 }}         | ${-9}
      ${'complex math (float)'}                      | ${'(BAR % 2) - (FOO * 3)'}                                                                               | ${{ BAR : 4.5, FOO : 3.5 }}     | ${-10}
      ${'simple math with negative numbers'}         | ${'-4 - -8 + 1'}                                                                                         | ${{}}                         | ${5}
      ${'simple math with negative numbers (float)'} | ${'-4.5 - -8.5 + 1.2'}                                                                                   | ${{}}                         | ${5.2}
      ${'all operators'}                             | ${'-4 - 1 + 2 % 5 * 2**3 + (1 | 2) - ((2 & 3)>>1) - ((2 ^ 3) << 1) + ~(~1)'}                             | ${{}}                         | ${12}
      ${'all operators (float)'}                     | ${'-4.5 - 1.5 + 2.5 % 5 * 2.2**3.5 + (1.2 | 2.3) - ((2.2 & 3.2)>>1.5) - ((2.5 ^ 3.5) << 1.2) + ~(~1.3)'} | ${{}}                         | ${34.48384074529732}
    `(
      "$desc; eval of '$expression' with conditions '$parameters' -> $result'",
      ({ expression, parameters, result }) => {
        const evaluator = new Evaluator({ parameters })
        const precision = 1000000000
        expect(Math.round(evaluator.evalNumber(expression) * precision)).toBe(
          Math.round(result * precision)
        )
      }
    )
  })

  describe('standard constants', () => {
    const standards = Object.assign({}, booleans, severities)

    test.each(Object.keys(standards))(
      "Recognizes standard constant '%s'",
      (key) => {
        const evaluator = new Evaluator()
        expect(evaluator.evalNumber(key)).toEqual(standards[key])
      }
    )

    test.each([
      [
        'Can exclude booleans',
        { excludeBooleans : true },
        { booleans : false, severities : true },
      ],
      [
        'Can exclude severities',
        { excludeSeverities : true },
        { booleans : true, severities : false },
      ],
      [
        'Can exclude booleans and severities',
        { excludeBooleans : true, excludeSeverities : true },
        { booleans : false, severities : false },
      ],
      [
        'Can exclude all stanadrds',
        { excludeStandards : true },
        { booleans : false, severities : false },
      ],
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
