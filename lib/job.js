/*
 * persist.js - job.js
 * Copyright(c) 2017 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

'use strict'

const EventEmitter = require('events')
const md5 = require('blueimp-md5')

class Job extends EventEmitter {

  constructor (options) {
    super()

    this.id = options.id
    this.type = options.type
    this.payload = options.payload
    this.state = 'pending'
    this.created_at = this.updated_at = Date.now()
    this.hash = md5(this.payload)
  }

  process (runner, cb) {
    this.state = 'running'
    return runner(this, (err, data) => {
      if (err) {
        this.state = 'failed'
      } else {
        this.state = 'done'
      }
      cb && cb(err, data)
    })
  }

  toJSON () {
    return {
      id: this.id,
      state: this.state,
      hash: this.hash,
      payload: this.payload,
      created_at: this.created_at
    }
  }

  toString () {
    return JSON.stringify(this.toJSON())
  }
}

module.exports = Job
