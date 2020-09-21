import test from 'ava'
import { collectPackagesInfo } from './main'

test.beforeEach(async (t) => {
  // eslint-disable-next-line no-console
  t.context.info = await collectPackagesInfo().catch(console.trace)
})

test('collectPackagesInfo has correct keys', (t) => {
  const { info } = t.context
  t.true(Object.keys(info).includes('concise'))
})

test('collectPackagesInfo include plugins', (t) => {
  const { info } = t.context
  t.true(info.concise.plugins.includes('eslint-comments'))
})
