'use strict'

const a = {}
const b = null
const k = 'test'
const f = ({ test = false }) => test

f({
  ...a,
  b,
  [k]: true,
})
