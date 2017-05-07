import path from 'path'

import test from 'ava'
import globby from 'globby'
import execa from 'execa'

async function checkGoodStyle(t, filename) {
  const result = await execa('eslint', [filename], {
    cwd: __dirname,
  })
  t.is(result.code, 0)
}

globby('./fixtures/good/*.js', {
  cwd: __dirname,
}).then(filenames =>
  filenames.forEach(filename => {
    test(
      `Check good style: ${path.basename(filename)}`,
      checkGoodStyle,
      filename
    )
  })
)
