import { plainFloatReString } from 'regex-repo'

const singleOp = '[!~]'
const dualOp = '(?:&&|[|]{2}|==|!=|[*]{2}|[+%*/^&|<>-]|<=|>=|<<|>>)'
const anyOp = `(?:${singleOp}|${dualOp})`
const literal = `(?:(?:${plainFloatReString})|false|true)`
// const param = '(?:[A-Z_][A-Z0-9_]*)'
const param = '(?:(?:[a-z_][a-z0-9_]*\\.)*[A-Z_][A-Z0-9_]*)'
// const anyValue = `(?:${literal}|${param})`
const opener = `(?:[ (]|${singleOp})`
const closer = '[ )]'

const paramRe = new RegExp(`(?:^|${opener}|${anyOp})(${param})`, 'g')

const dualOpChain = `(?:${opener}*${dualOp}${opener}*${literal}${closer}*)`
const safeEvalRe = new RegExp(
  `^\\s*(?:${opener}*${literal}${dualOpChain}*${closer}*)?$`
)

export { paramRe, safeEvalRe }
