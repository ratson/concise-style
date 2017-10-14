'use strict'

const loadConfigs = require('./load-configs')

describe('load-configs', () => {
  let configs

  beforeAll(async () => {
    configs = await loadConfigs()
  })

  it('has airbnb rules', async () => {
    expect(configs['eslint-config-airbnb'].rules['global-require']).toBe(
      'error'
    )
  })
})
