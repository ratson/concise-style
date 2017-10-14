'use strict'

const loadConfigs = require('./load-configs')

describe('load-configs', () => {
  let configs

  beforeAll(async () => {
    configs = await loadConfigs()
  })

  it('has airbnb rules', () => {
    expect(configs['eslint-config-airbnb'].rules['global-require']).toBe(
      'error'
    )
  })

  it('has readable-code rules', () => {
    expect(configs['readable-code'].rules['global-require']).toBe('off')
  })
})
