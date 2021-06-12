const paramRe = /(^|[ (!&=|+-])([A-Z_][A-Z0-9_]*)/g
// start with: (, number, bool, or unary op !
// at least on space or param
// then maybe 0+ safe stuff
// Note that this RE relies on the intentional spacing
// TODO: we could lock down further by requring expressions on eithre side of dual operators
const safeEvalRe =
  /^ *(\(|[0-9]+|false|true|!)(( |\()+([0-9]+|true|false|!|&&|[|]{2}|==|!=|\+|-|%|\*|<|>|<=|>=)( |\)*))* *$/

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
  * 'parameters' maps strings to values. E.g.: parameters `{ "IS_CONTRACTOR": 1 }` would cause the condition
  * `IS_CONTRACTOR` to evaluate true.
  *
  * 'zeroRes' is an array of RegExps used to match against a condition string *after* resolving all the parameters. If a
  *    match is made, then that value is set to zero. I.e., `zeroRes` determines which parameters are default zero.
  */
  constructor(settings) {
    Object.assign(this, settings)

    this.parameters = this.parameters || {}
    this.zeroRes = this.zeroRes || []
  }

  evalTruth(origExpression) {
    if (typeof origExpression !== 'string') {
      throw new Error(`Expression must be a string. Got: '${origExpression}'.`)
    }

    let expression = origExpression // save original expression in case we need to reflect to user on error

    // replace all the parameters in the expression
    const results = expression.matchAll(paramRe)
    for (const result of results) {
      const param = result[2]
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

      // 'replaceAll' not supported on node (TODO: add Babel tform); though 'replace' does replace all *if* first arg is
      // RE... so... maybe not necessary?)
      expression = expression.replace(new RegExp(`(^|[^A-Z0-9_])${param}([^A-Z0-9_]|$)`, 'g'), `$1 ${val} $2`)
    }

    // check that everything is save
    if (!expression.match(safeEvalRe)) {
      throw new Error(`Invalid expression does not fully resolve or has unsafe code: ${origExpression} => ${expression}`)
    }
    // else, let's eval it
    return Function(`"use strict";return (${expression}) ? true : false`)() // eslint-disable-line no-new-func
  }
}

export { Evaluator }
