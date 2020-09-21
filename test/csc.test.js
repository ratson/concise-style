import path from 'path'

import execa from 'execa'
import test from 'ava'

test('code should pass csc lint', async (t) => {
  const result = await execa(require.resolve('../packages/csc/lib/cli'), {
    cwd: path.join(__dirname, '..'),
  })
  t.is(result.exitCode, 0)
})
