// @flow
const assert = require('assert')

const f = (i: int) => i + 1

type A = {
  a: int,
}

const g = ({ a }: A) => a + 1

assert(f(0) + g({ a: 0 }) === 2)
