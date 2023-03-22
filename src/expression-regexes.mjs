const singleOps = '[!~]'
const values = '(?:-?[0-9]+|false|true)'

const paramRe = /(?:^|[ (!&=|^~+%/<>-])([A-Z_][A-Z0-9_]*)/g
// start with: (, number, bool, or unary op !
// at least one space or param
// then maybe 0+ safe stuff
// Note that this RE relies on the intentional spacing
// TODO: we could lock down further by requring expressions on eithre side of dual operators
const safeEvalRe =
//    | a series of terms, optionally bounded by parenthesis
//                               |
  /^ *(?:(?:\(*(?!>\))|-?[0-9]+|false|true|!|~)(?: *|\()+(?:-?[0-9]+|true|false|&&|[|]{2}|==|!=|[+~%*/^&|<>!-]|<=|>=)*(?: |\)*))* *$/

export { paramRe, safeEvalRe }
