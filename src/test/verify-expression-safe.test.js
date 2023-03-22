/* global describe expect test */
import { verifyExpressionSafe } from '../verify-expression-safe'

describe('verifyExpressionSafe', () => {
  test.each([
    '',
    'true',
    'false',
    '25',
    '-25',
    '!0',
    '!true',
    '~19',
    '1 + 2**3 - -18',
    'true  && (! false || (( false && false ) && false)))'
  ])("recognizes '%s' as SAFE", (expression) => expect(() => verifyExpressionSafe({ expression })).not.toThrow())

  test.each([
    'functionCall()',
    'functionCallWithSpace ()',
    'ALLCAP_FUNCTION()',
    'ALLCAP_FUNCTION_WITH_SPACE ()',
    'ALLCAP_FUNCTION_WITH_ARG(true)',
    'ALLCAP_FUNCTION_WITH_SPACE_AND_ARG (true)',
    'PARAM.VALUE',
  ])("recognizes '%s' as UNSAFE", (expression) => expect(() => verifyExpressionSafe({ expression })).toThrow())
})