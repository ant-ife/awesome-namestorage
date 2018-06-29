'use strict'

const assert = require('assert')
const { toString } = require('./helper')

require('../index')

const NameStorage = window.NameStorage

describe('test/namestorage_empty.test.js', () => {
  const ORIGIN_NAME = 'nameStorage:named-storage?xddd=8&yddd=9&zddd=10'

  it('init', () => {
    window.name = ORIGIN_NAME
    const ns = new NameStorage(ORIGIN_NAME)
    assert.equal(ns.toString(), toString(ORIGIN_NAME))
  })

  it('nameStorage.setItem() and getItem()', () => {
    const ns = new NameStorage(ORIGIN_NAME)
    ns.setItem('a', 1)
    assert.equal(ns.getItem('a'), '1')
  })

  it('nameStorage.removeItem()', () => {
    const ns = new NameStorage(ORIGIN_NAME)
    const key = 'b'
    const val = 2
    ns.setItem(key, val)
    ns.removeItem(key)
    assert.equal(ns.getItem(key), null)
  })

  it('nameStorage.clear() and toString()', () => {
    const ns = new NameStorage(ORIGIN_NAME)
    const key = 'c'
    const val = 3
    ns.setItem(key, val)
    ns.clear()
    assert.equal(ns.getItem(key), null)
    assert.equal(ns.toString(), toString(ORIGIN_NAME))
  })
})


//
