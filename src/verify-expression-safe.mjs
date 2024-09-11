import { safeEvalRe } from './expression-regexes'

const verifyExpressionSafe = ({ expression, origExpression }) => {
  if (!expression.match(safeEvalRe)) {
    throw new Error(
      `Invalid expression does not fully resolve or has unsafe code: ${origExpression ? `${origExpression} => ` : ''}${expression}`
    )
  }
}

export { verifyExpressionSafe }
