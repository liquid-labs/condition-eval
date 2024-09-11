import { booleans, severities } from './constants'
import { extractParameters } from './extract-parameters'
import { verifyExpressionSafe } from './verify-expression-safe'

/**
 * A safe-ish (TODO: developed based on a Stackexchange post; find and link?) boolean expression evaluator.
 */
const Evaluator = class {
  // declare recognized internal parameters
  parameters
  zeroRes

  /**
   * Recognizes 'parameters' and 'zeroRes' field.
   * @param {object} [options = {}] - Constructor options.
   * @param {object} [options.parameters = undefined] - Parameter value mappings to use in the evalutation. E.g.:
   *   parameters `evaluator.evalTrue({ parameters : { IS_CONTRACTOR: 1 } })` is 'true'.
   * @param {RegExp[]} [options.zeroRes = undefined] - An array of RegExps used to match against a condition string
   *   _after_ resolving all the parameters. If a match is made, then that value is set to zero. I.e., `zeroRes`
   *   determines which parameters are default zero.
   * @param {boolean} [options.excludeBooleans = false] - If `true`, then does not load standard boolean mappings for
   *   `TRUE`/`FALSE`, `YES`/`NO`, `ALWAYS`/`NEVER`.
   * @param {boolean} [options.excludeSeverities = false] - If `true`, then does not load standard severity mappings on
   *   a 0-4 scale: `NONE` (0), `LOW`/`MINOR`\`TRIVIAL` (1), `MODERATE` (2), `HIGH`/`SEVERE` (3), and
   *   `CRITICAL`/`EXISTENTIAL` (4).
   * @param {boolean} [options.excludeStandards = false] - Equivalent to setting `excludeBooleans : false` and
   *   `excludeSeverities : false`.
   */
  constructor({
    parameters,
    zeroRes,
    excludeBooleans = false,
    excludeSeverities = false,
    excludeStandards = false,
  } = {}) {
    this.parameters = Object.assign(
      {},
      parameters,
      excludeBooleans === true || excludeStandards === true ? null : booleans,
      excludeSeverities === true || excludeStandards === true
        ? null
        : severities
    )
    this.zeroRes = zeroRes || []
  }

  #eval(origExpression, funcFunc) {
    if (typeof origExpression !== 'string') {
      throw new Error(`Expression must be a string. Got: '${origExpression}'.`)
    }

    let expression = origExpression // save original expression in case we need to reflect to user on error

    // replace all the parameters in the expression
    const params = extractParameters({ expression })
    for (const param of params) {
      const paramBits = param.split('.')
      let val = paramBits.reduce((acc, r) => acc?.[r], this.parameters)
      if (val === undefined) {
        // if not defined, look on process.env
        val = process.env[param]
      }
      if (val === undefined) {
        if (this.zeroRes.some((re) => param.match(re))) {
          val = 0
        }
        else {
          throw new Error(
            `Condition parameter '${param}' is not defined. Update settings and/or check expression.`
          )
        }
      }
      else if (val.match?.(/\s*(?:y(?:es)?|t(?:rue)?)\s*/i)) {
        val = 'true'
      }
      else if (val.match?.(/\s*(?:n(?:o)?|f(?:alse)?)\s*/i)) {
        val = 'false'
      }
      else if (val.match && !val.match(/\d+(\.\d+)?/)) {
        // then convert to true or false based on whether it's empty or not
        val = !!val
      }

      // 'replaceAll' not supported on node (TODO: add Babel tform); though 'replace' does replace all *if* first arg is
      // RE... so... maybe not necessary?)
      expression = expression.replace(
        new RegExp(`(^|[^A-Z0-9_])${param}([^A-Z0-9_]|$)`, 'g'),
        `$1 ${val} $2`
      )
    }

    // check that everything is safe
    verifyExpressionSafe({ expression, origExpression })

    // else, let's eval it
    return Function(funcFunc(expression))() // eslint-disable-line no-new-func
  }

  evalTruth(origExpression) {
    return this.#eval(
      origExpression,
      (expression) => `"use strict";return (${expression}) ? true : false`
    )
  }

  evalNumber(origExpression) {
    return this.#eval(
      origExpression,
      (expression) => `"use strict";return (${expression}) + 0`
    )
  }
}

export { Evaluator }
