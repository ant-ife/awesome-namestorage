'use strict'

// 利用 window.name 实现跨页面跨域的数据传输。

const SCHEME = 'nameStorage:'
const RE_PAIR = /^([^=]+)(?:=(.*))?$/
const Q = '?'
const EQ = '='
const AND = '&'

window.WINDOW_NAME_STORAGE = window.WINDOW_NAME_STORAGE || {}

export default class NameStorage {
  constructor (ORIGIN_NAME) {
    this.ORIGIN_NAME = ORIGIN_NAME || ''
    this.originNameObj = {}
    this.nameStorage = {}

    this.parse(window.name)
    this.registerEvent()
  }

  registerEvent () {
    // Save the last data for the next page.
    addEventListener(window, 'beforeunload', () => {
      this.save()
    })
  }

  // addEventLister implementation
  // @param {HTMLElement} element.
  // @param {String} eventName.
  // @param {Function} handler.
  addEventListener (element, eventName, handler) {
    if (!element) { return }

    if (element.addEventListener) {
      element.addEventListener(eventName, handler, false)
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, function (evt) {
        handler.call(element, evt)
      })
    }
  }


  // 解析并初始化 name 数据。
  // 标准的 nameStorage 数据格式为 `nameStorage:origin-name?key=value`
  // @param {String} name.
  parse (name) {
    if (name && !!~name.indexOf(SCHEME)) {
      const match = name.split(/[:?]/)

      match.shift()                      // scheme: match[0];
      this.ORIGIN_NAME = decodeURIComponent(match.shift()) || ''  // match[1]

      const params = match.join('')        // match[2,...]

      const pairs = params.split(AND)
      for (let i = 0, pair, key, value, l = pairs.length; i < l; i++) {
        pair = pairs[i].match(RE_PAIR)
        if (!pair || !pair[1]) { continue }

        key = decodeURIComponent(pair[1])
        value = decodeURIComponent(pair[2]) || ''

        window.WINDOW_NAME_STORAGE[key] = value
        this.originNameObj[key] = value
      }
    } else {
      this.ORIGIN_NAME = name || ''
    }
  }

  // 写入数据。
  // @param {String} key, 键名。
  // @param {String} value, 键值。
  setItem (key, value) {
    if (!key || typeof value === 'undefined') { return }
    window.WINDOW_NAME_STORAGE[key] = String(value)
    this.save()
  }

  // 读取数据。
  // @param {String} key, 键名。
  // @return {String} 键值。如果不存在，则返回 `null`。
  getItem (key) {
    return window.WINDOW_NAME_STORAGE.hasOwnProperty(key) ? window.WINDOW_NAME_STORAGE[key] : null
  }

  // 移除数据。
  // @param {String} key, 键名。
  removeItem (key) {
    if (!window.WINDOW_NAME_STORAGE.hasOwnProperty(key)) { return }
    window.WINDOW_NAME_STORAGE[key] = null
    delete window.WINDOW_NAME_STORAGE[key]
    this.save()
  }

  // 清空 nameStorage。
  clear () {
    window.WINDOW_NAME_STORAGE = {}
    this.save()
  }

  valueOf () {
    return window.WINDOW_NAME_STORAGE
  }

  toString () {
    const name = window.name
    return ~name.indexOf(SCHEME) ? name : SCHEME + name
  }

  // 保存数据到 win.name
  // 如果没有存储数据，则恢复原始窗口名称(win.name)。
  save () {
    const pairs = []
    let empty = true
    let value

    for (const key in this.originNameObj) {
      empty = false
      value = this.originNameObj[key] || ''
      pairs.push(encodeURIComponent(key) + EQ + encodeURIComponent(value))
    }

    window.name = empty ? this.ORIGIN_NAME
      : SCHEME + encodeURIComponent(this.ORIGIN_NAME) + Q + pairs.join(AND)
  }
}

window.NameStorage = NameStorage
