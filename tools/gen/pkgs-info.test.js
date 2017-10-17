'use strict'

const collectPackagesInfo = require('./pkgs-info')

describe('collectPackagesInfo', () => {
  let info

  beforeAll(async () => {
    info = await collectPackagesInfo().catch(console.trace)
  })

  it('has correct keys', () => {
    expect(Object.keys(info)).toContain('concise')
  })

  it('include plugins', () => {
    expect(info.concise.plugins).toContain('eslint-comments')
  })
})
