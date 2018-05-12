import test from 'ava'
import execa from 'execa'
import Path from 'path'

test('respect .eslintignore', async t => {
  const filename = require.resolve('./fixtures/preslint-ignore/ignored.js')
  const { code } = await execa(
    require.resolve('../packages/preslint/cli'),
    [filename],
    {
      cwd: Path.dirname(filename),
    }
  )
  t.is(code, 0)
})
