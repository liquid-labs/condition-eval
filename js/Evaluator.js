const paramRe = new RegExp('(^|[ (])([A-Z_][A-Z0-9_]+)', 'g')
const safeEvalRe = new RegExp('^ *(\\(|[0-9]+|false|true)(( |\\()+([0-9]+|true|false|&&|[|]{2}|==|!=|\\+|-|%|\\*)( |\\)*))* *$')

const Evaluator = class {
  parameters
  zeroRes

  constructor(settings) {
    Object.assign(this, settings)

    this.parameters = this.parameters || {}
    this.zeroRes = this.zeroRes || []
  }

  evalTruth(origExpression) {
    if (typeof origExpression !== 'string') {
      throw new Error(`Expression must be a string. Got: '${expression}'.`)
    }

    var expression = origExpression // save original expression in case we need to reflect to user on error

    // replace all the parameters in the expression
    const results = expression.matchAll(paramRe)
    for (var result of results) {
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
      expression = expression.replace(new RegExp(`(^|[^A-Z0-9_])${param}([^A-Z0-9_]|$)`), `$1 ${val} $2`)
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
