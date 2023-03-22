import { booleans, severities } from './constants'

const paramRe = /(?:^|[ (!&=|^~+%/<>-])([A-Z_][A-Z0-9_]*)/g
// start with: (, number, bool, or unary op !
// at least one space or param
// then maybe 0+ safe stuff
// Note that this RE relies on the intentional spacing
// TODO: we could lock down further by requring expressions on eithre side of dual operators
const safeEvalRe =
  /^ *(?:\(|-?[0-9]+|false|true|!)(?:(?: *|\()+(?:-?[0-9]+|true|false|&&|[|]{2}|==|!=|[+~%*/^&|!<>-]|<=|>=)(?: |\)*))* *$/

/**
* A safe-ish (TODO: developed based on a Stackexchange post; find and link?) boolean expression evaluator.
*/
const Evaluator = class {
  // declare recognized internal parameters
  parameters
  zeroRes

  /**
  * Recogrizes 'parameters' and 'zeroRes' field.
  *
  * - `parameters`: (opt) maps strings to values. E.g.: parameters `{ "IS_CONTRACTOR": 1 }` would cause the condition
  *    `IS_CONTRACTOR` to evaluate true.
  *  - `zeroRes`: (opt) is an array of RegExps used to match against a condition string *after* resolving all the
  *    parameters. If a match is made, then that value is set to zero. I.e., `zeroRes` determines which parameters are
  *    default zero.
  * - `excludeBooleans`: (opt, def: `false`) if `true`, then does not load standard boolean mappings for `TRUE`/
  *   `FALSE`, `YES`/`NO`, `ALWAYS`/`NEVER`
  * - `excludeSeverities`: (opt, def: `false`) if `true`, then does not load standard severity mappyngs on a 0-4
  *   scale: `NONE` (0), `LOW`/`MINOR`\`TRIVIAL` (1), `MODERATE` (2), `HIGH`/`SEVERE` (3), and `CRITICAL`/`EXISTENTIAL`
  *   (4).
  */
  constructor({
    parameters,
    zeroRes,
    excludeBooleans = false,
    excludeSeverities = false,
    excludeStandards = false
  } = {}
  ) {
    this.parameters = Object.assign(
      {},
      parameters,
      excludeBooleans === true || excludeStandards === true ? null : booleans,
      excludeSeverities === true || excludeStandards === true ? null : severities
    )
    this.zeroRes = zeroRes || []
  }

  #eval(origExpression, funcFunc) {
    if (typeof origExpression !== 'string') {
      throw new Error(`Expression must be a string. Got: '${origExpression}'.`)
    }

    let expression = origExpression // save original expression in case we need to reflect to user on error

    // replace all the parameters in the expression
    const results = expression.matchAll(paramRe)
    for (const result of results) {
      const param = result[1]
      let val = this.parameters[param] // look on the parameter object
      if (val === undefined) { // if not defined, look on process.env
        val = process.env[param]
      }
      if (val === undefined) {
        if (this.zeroRes.some((re) => param.match(re))) {
          val = 0
        }
        else {
          throw new Error(`Condition parameter '${param}' is not defined. Update settings and/or check expression.`)
        }
      }
      else if (val.match?.(/\s*(?:y(?:es)?|t(?:rue)?)\s*/i)) {
        val = 'true'
      }
      else if (val.match?.(/\s*(?:n(?:o)?|f(?:alse)?)\s*/i)) {
        val = 'false'
      }
      else if (val.match && !val.match(/\d+(\.\d+)?/)) { // then convert to true or false based on whether it's empty or not
        val = !!val
      }

      // 'replaceAll' not supported on node (TODO: add Babel tform); though 'replace' does replace all *if* first arg is
      // RE... so... maybe not necessary?)
      expression = expression.replace(new RegExp(`(^|[^A-Z0-9_])${param}([^A-Z0-9_]|$)`, 'g'), `$1 ${val} $2`)
    }

    // check that everything is save
    if (!expression.match(safeEvalRe)) {
      throw new Error(`Invalid expression does not fully resolve or has unsafe code: ${origExpression} => ${expression}`)
    }
    // else, let's eval it
    return Function(funcFunc(expression))() // eslint-disable-line no-new-func
  }

  evalTruth(origExpression) {
    return this.#eval(origExpression, (expression) => `"use strict";return (${expression}) ? true : false`)
  }

  evalNumber(origExpression) {
    return this.#eval(origExpression, (expression) => `"use strict";return (${expression}) + 0`)
  }
}

const extractParameters = (origExpression) => {
  const params = []
  for (const results of origExpression.matchAll(paramRe)) {
    params.push(results[1])
  }
  return params.filter((p, i, arr) => i === arr.indexOf(p))
}

export { Evaluator, extractParameters }
