/*
 * persist.js - index.js
 * Copyright(c) 2017 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

'use strict'

const MemoryStore = require('./memory')
const Job = require('./job')

const prefix = 'persist.js'
let jobs = []

class Persist {

  constructor(options) {
    options = options || {}
    this.store = options.store || new MemoryStore()
    this.autoStart = options.autoStart && true
    this.jobTypes = {};
  }

  register(type, job) {
    this.jobTypes[type] = job
  }

  createJob(type, data) {
    const job = new Job({
      id: `${prefix}:${this.type}:${jobs.length + 1}`,
      payload: data,
      type: type
    })

    jobs.push(job)
    this.store.set(job.id, job.toJSON());

    if (jobs.length === 1) {
      this.processNext()
    }

    return job
  }

  processNext() {
    var nextJob = jobs.filter(j => j.state === 'pending')[0]
    if (nextJob) {
      setTimeout(() => {
        this.process(nextJob)
      }, 0)
    }
  }

  complete(job, data) {
    this.store.del(job.id)
    this.store.set(job.hash, data)
    job.emit('data', data)
  }

  fail(err, job) {
    this.emit('job:fail', err)
    this.store.set(job.id, job.toJSON())
  }

  process(job) {

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

exports = module.exports = Persist;

/**
 * Persist.js Version
 */

exports.version = require('../package.json').version;

/**
 * Create a new Persisit `instance`.
 *
 * @return {Persist}
 * @api public
 */

exports.instance = function(options) {
  if (!Persist.singleton) {
    Persist.singleton = new Persist(options)
  }
  return Persist.singleton;
}
