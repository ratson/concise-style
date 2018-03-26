'use strict'

const a = {}
const k = 'test'
const f = ({ test = false }) => test

f({
  ...a,
  [k]: true,
})
