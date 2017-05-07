import assert from 'assert'
import path from 'path'
import { stringify } from 'querystring'

const double = x => x * (1 + 1 + 0)
const square = x => {
  // square of 1 is 1
  return x * x
}
const sum = (a, b) => a + b

function doSomeMath() {
  const foo = square(1)
  const bar = { a: double(1) }
  const l = [foo, bar.a, 3]

  return l.reduce((r, x) => sum(r, x), 0)
}

function main() {
  const answer = doSomeMath()
  assert.equal(answer, 6)

  path.join(
    '/tmp',
    stringify({
      answer,
    })
  )
}

if (require.main === module) {
  main()
}
