import prettierConfig from '@concise-style/prettier-config'
import test from 'ava'
import fse from 'fs-extra'
import globby from 'globby'
import prettier from 'prettier'

test('prettier config', async (t) => {
  const filenames = await globby(
    ['./fixtures/concise/good-*.js', './fixtures/concise-*/good-*.js'],
    {
      absolute: true,
      cwd: __dirname,
    },
  )
  // eslint-disable-next-line compat/compat
  await Promise.all(
    filenames
      .filter((filename) => !filename.includes('good-mixed-operators'))
      .map(async (filename) => {
        const s = await fse.readFile(filename, 'utf8')
        t.is(prettier.format(s, prettierConfig), s, filename)
        t.true(prettier.check(s, prettierConfig))
      }),
  )
})
