import {CONSTANT} from './dummy-module'

const sum = (a, b) => a + b

function main() {
  const foo = 1 + CONSTANT
  const bar = {a: 1}

  return sum(foo, bar.a)
}

main()
