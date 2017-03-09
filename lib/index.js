/*
 * persist.js - index.js
 * Copyright(c) 2017 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

'use strict'

const EventEmitter = require('events')
const MemoryStore = require('./memory')
const Job = require('./job')

const prefix = 'persist.js'
let jobs = []

class Persist extends EventEmitter {

  constructor (options) {
    super()

    options = options || {}
    this.store = options.store || new MemoryStore()
    this.autoStart = options.autoStart || true
    this.jobTypes = {}
    this.state = 'idle'
  }

  register (type, job) {
    if (typeof job !== 'function') {
      throw new TypeError('Job runner must be a function!')
    }
    this.jobTypes[type] = job
  }

  createJob (type, data) {
    const job = new Job({
      id: `${prefix}:${type}:${jobs.length + 1}`,
      payload: data,
      type: type
    })

    jobs.push(job)
    this.store.set(job.id, job.toJSON())

    if (this.autoStart) {
      this.processNext()
    }

    return job
  }

  start () {
    this.processNext()
  }

  processNext () {
    const nextJob = jobs.filter(j => j.state === 'pending')[0]
    if (nextJob && this.state === 'idle') {
      this.state = 'running'
      setTimeout(() => {
        this.process(nextJob)
      }, 0)
      return
    }
    this.state = 'idle'
  }

  complete (job, data) {
    this.store.del(job.id)
    this.store.set(job.hash, data)
    job.emit('data', data)
  }

  fail (err, job) {
    this.emit('job:fail', err)
  }

  process (job) {
    var runner = this.jobTypes[job.type]

    job.emit('start', job)

    var cache = this.store.get(job.hash)
    if (cache) {
      job.emit('data', cache)
    }

    job.process(runner, (err, data) => {
      if (err) {
        this.fail(err, job)
      } else {
        this.complete(job, data)
      }
      job.emit('end')
      this.processNext()
    })

    return this
  }

}

/**
 * Export `Persist`.
 */

exports = module.exports = Persist

/**
 * Persist.js Version
 */

exports.version = require('../package.json').version

/**
 * Create a new Persisit `instance`.
 *
 * @return {Persist}
 * @api public
 */

exports.instance = function (options) {
  if (!Persist.singleton) {
    Persist.singleton = new Persist(options)
  }
  return Persist.singleton
}
