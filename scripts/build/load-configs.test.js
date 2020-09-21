import test from 'ava'
import { loadConfigs, loadDeprecatedRules } from './main'

test.beforeEach(async (t) => {
  t.context.configs = await loadConfigs()
})

test('loadConfigs has airbnb rules', async (t) => {
  const { configs } = t.context
  t.is(configs['eslint-config-airbnb'].rules['global-require'], 'error')
})

test('loadConfigs has readable rules', async (t) => {
  const { configs } = t.context
  t.is(configs['eslint-config-readable'].rules['global-require'], 'off')
})

test('loadConfigs has ava plugin recommended rules', async (t) => {
  const { configs } = t.context
  t.is(configs['eslint-plugin-ava'].rules['ava/assertion-arguments'], 'error')
})

test.skip('loadDeprecatedRules has deprecated rules', (t) => {
  const deprecatedRules = loadDeprecatedRules()

  t.true(deprecatedRules.includes('indent-legacy'))
})
