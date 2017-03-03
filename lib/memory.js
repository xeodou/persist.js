/*
 * persist.js - memory.js
 * Copyright(c) 2017 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

'use strict'

class Memory {

  constructor() {
    this._store = {}
  }

  all() {
    return this._store
  }

  get(key) {
    return this._store[key]
  }

  set(key, value) {
    this._store[key] = value
    return this
  }

  del(key) {
    delete this._store[key]
    return this
  }
}

module.exports = Memory
