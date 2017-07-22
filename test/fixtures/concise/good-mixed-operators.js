'use strict'

const f = x => x
;[
  1 + 1 - 1,
  1 * 1 / 1,
  1 + 1 / 1 - 1 * 1,
  (1 & (1 << 1 >> 1)) | (1 ^ 1),
  true || (false && true),
].map(f)
