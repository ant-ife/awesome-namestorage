'use strict'

exports.toString = name => {
  const SCHEME = 'nameStorage:'
  return ~name.indexOf(SCHEME) ? name : SCHEME + name
}
