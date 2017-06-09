'use strict'

const { stringify } = require('querystring')

function main() {
  stringify({
    q: 'search',
  })
}

if (require.main === module) {
  main()
}
