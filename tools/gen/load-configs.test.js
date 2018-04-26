import test from 'ava'

import loadConfigs from './load-configs'

test.beforeEach(async t => {
  t.context.configs = await loadConfigs()
})

test('loadConfigs has airbnb rules', async t => {
  const { configs } = t.context
  t.is(configs['eslint-config-airbnb'].rules['global-require'], 'error')
})

test('loadConfigs has readable rules', async t => {
  const { configs } = t.context
  t.is(configs['eslint-config-readable'].rules['global-require'], 'off')
})

test('loadConfigs has ava plugin recommended rules', async t => {
  const { configs } = t.context
  t.is(configs['eslint-plugin-ava'].rules['ava/assertion-arguments'], 'error')
})

test('loadDeprecatedRules has deprecated rules', t => {
  const { loadDeprecatedRules } = loadConfigs
  const deprecatedRules = loadDeprecatedRules()

  t.true(deprecatedRules.includes('indent-legacy'))
})
