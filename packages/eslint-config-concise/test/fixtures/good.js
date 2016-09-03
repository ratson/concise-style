import {CONSTANT} from './fixtures/dummy-module'

const sum = (a, b) => a + b

function main() {
  const foo = 1 + CONSTANT
  const bar = {a: 1}
  const trailingCommas = {
    foo,
    bar,
  }

  return sum(trailingCommas.foo, bar.a)
}

main()
