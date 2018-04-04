'use strict'

const loadConfigs = require('./load-configs')

describe('loadConfigs', () => {
  let configs

  beforeAll(async () => {
    configs = await loadConfigs()
  })

  it('has airbnb rules', () => {
    expect(configs['eslint-config-airbnb'].rules['global-require']).toBe(
      'error'
    )
  })

  it('has readable rules', () => {
    expect(configs['eslint-config-readable'].rules['global-require']).toBe(
      'off'
    )
  })

  it('has ava plugin recommended rules', () => {
    expect(configs['eslint-plugin-ava'].rules['ava/assertion-arguments']).toBe(
      'error'
    )
  })
})

describe('loadDeprecatedRules', () => {
  const { loadDeprecatedRules } = loadConfigs
  const deprecatedRules = loadDeprecatedRules()

  it('has deprecated rules', () => {
    expect(deprecatedRules).toContain('indent-legacy')
  })
})
