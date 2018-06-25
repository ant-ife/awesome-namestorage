// TODO use macaca test

// 随机初始窗口名称。
const random = Math.random()
let ORIGIN_NAME
if (random < 0.33) {
  ORIGIN_NAME = ''
} else if (random < 0.66) {
  ORIGIN_NAME = 'named-window'
} else {
  ORIGIN_NAME = 'nameStorage:named-storage?x=8&y=9&z=10'
}
window.name = ORIGIN_NAME

const expect = require('expect.js')

describe('nameStorage: ' + ORIGIN_NAME, function () {
  it('init', function (done) {
    require.async('../index.js', function (nameStorage) {
      expect(nameStorage.toString()).to.equal(toString(ORIGIN_NAME))
      done()
    })
  })

  it('nameStorage.setItem() and getItem()', function (nameStorage) {
    nameStorage.setItem('a', 1)
    expect(nameStorage.getItem('a')).to.equal('1')
  })

  it('nameStorage.removeItem()', function (nameStorage) {
    const key = 'b'
    const val = 2
    nameStorage.setItem(key, val)
    nameStorage.removeItem(key)
    expect(nameStorage.getItem(key)).to.equal(null)
  })

  it('nameStorage.clear() and toString()', function (nameStorage) {
    const key = 'c'
    const val = 3
    nameStorage.setItem(key, val)
    nameStorage.clear()
    expect(nameStorage.getItem(key)).to.equal(null)
    expect(nameStorage.toString()).to.equal(toString(ORIGIN_NAME).replace(/\?.*/, ''))
  })
})

const SCHEME = 'nameStorage:'
function toString (name) {
  return name.indexOf(SCHEME) === 0 ? name : SCHEME + name
}
