const double = x => x * (1 + 1 + 0)
const sum = (a, b) => a + b

function main() {
  const foo = double(1)
  const bar = {a: 1}
  const l = [
    foo,
    bar.a,
    3,
  ]

  return l.reduce((r, x) => sum(r, x), 0)
}

main()
