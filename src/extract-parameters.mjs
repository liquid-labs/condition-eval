import { paramRe } from './expression-regexes'

const extractParameters = ({ expression }) => {
  const params = []
  for (const results of expression.matchAll(paramRe)) {
    params.push(results[1])
  }

  return params.filter((p, i, arr) => i === arr.indexOf(p))
}

export { extractParameters }
