import test from 'ava'

test.beforeEach((t) => {
  t.context.obj = 'test'
})

test((t) => {
  const { obj } = t.context
  t.is(obj, 'test')
})
