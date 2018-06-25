// nameStorage
//
// 利用 window.name 实现跨页面跨域的数据传输。

const win = window

const SCHEME = 'nameStorage:'
const RE_PAIR = /^([^=]+)(?:=(.*))?$/
const Q = '?'
const EQ = '='
const AND = '&'

const encode = encodeURIComponent
const decode = decodeURIComponent

let STORAGE = {}
let ORIGIN_NAME

const nameStorage = {};

// 解析并初始化 name 数据。
// 标准的 nameStorage 数据格式为 `nameStorage:origin-name?key=value`
// @param {String} name.
function parse (name) {
  if (name && name.indexOf(SCHEME) === 0) {
    const match = name.split(/[:?]/)

    match.shift()                      // scheme: match[0];
    ORIGIN_NAME = decode(match.shift()) || ''  // match[1]

    const params = match.join('')        // match[2,...]

    const pairs = params.split(AND)
    for (let i = 0, pair, key, value, l = pairs.length; i < l; i++) {
      pair = pairs[i].match(RE_PAIR)
      if (!pair || !pair[1]) { continue }

      key = decode(pair[1])
      value = decode(pair[2]) || ''

      STORAGE[key] = value
    }
  } else {
    ORIGIN_NAME = name || ''
  }
}

// 初始化数据
parse(win.name)

// 写入数据。
// @param {String} key, 键名。
// @param {String} value, 键值。
nameStorage.setItem = function (key, value) {
  if (!key || typeof value === 'undefined') { return }
  STORAGE[key] = String(value)
  save()
}

// 读取数据。
// @param {String} key, 键名。
// @return {String} 键值。如果不存在，则返回 `null`。
nameStorage.getItem = function (key) {
  return STORAGE.hasOwnProperty(key) ? STORAGE[key] : null
}

// 移除数据。
// @param {String} key, 键名。
nameStorage.removeItem = function (key) {
  if (!STORAGE.hasOwnProperty(key)) { return }
  STORAGE[key] = null
  delete STORAGE[key]
  save()
}

// 清空 nameStorage。
nameStorage.clear = function () {
  STORAGE = {}
  save()
}

nameStorage.valueOf = function () {
  return STORAGE
}

nameStorage.toString = function () {
  const name = win.name
  return name.indexOf(SCHEME) === 0 ? name : SCHEME + name
}

// 保存数据到 window.name
// 如果没有存储数据，则恢复原始窗口名称(window.name)。
function save () {
  const pairs = []
  let empty = true
  let value

  // 获取数据
  parse(win.name)
  for (const key in STORAGE) {
    if (!STORAGE.hasOwnProperty(key)) { continue }
    empty = false

    value = STORAGE[key] || ''
    pairs.push(encode(key) + EQ + encode(value))
  }

  win.name = empty ? ORIGIN_NAME
    : SCHEME + encode(ORIGIN_NAME) + Q + pairs.join(AND)
}

// addEventLister implementation
// @param {HTMLElement} element.
// @param {String} eventName.
// @param {Function} handler.
function addEventListener (element, eventName, handler) {
  if (!element) { return }

  if (element.addEventListener) {
    element.addEventListener(eventName, handler, false)
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, function (evt) {
      handler.call(element, evt)
    })
  }
}

// Save the last data for the next page.
addEventListener(win, 'beforeunload', function () {
  save()
})

win.nameStorage = nameStorage

module.exports = nameStorage
