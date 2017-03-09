/*
 * persist.js - lib.index.test.js
 * Copyright(c) 2017 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

'use strict'

const test = require('ava')
const simpleJob = require('./fixture/simple_job')
const Persist = require('../lib')

const instance = Persist.instance()

test('should register a job.', t => {
  instance.register('simpleJob', simpleJob)
  t.is(typeof instance.jobTypes['simpleJob'], 'function')
})

test('should throw an error.', t => {
  t.throws(() => {
    instance.register('lorem', {})
  })
})

test.cb('should create a job.', t => {
  t.plan(1)

  var job = instance.createJob('simpleJob', {
    'lorem': 'ipsum'
  })
  job.on('data', function (data) {
    t.deepEqual(data, {
      'lorem': 'ipsum'
    })
  })
  job.on('end', t.end)
})

test.cb('should hit cache first.', t => {
  t.plan(2)

  var job = instance.createJob('simpleJob', {
    'lorem': 'ipsum'
  })
  job.on('data', function (data) {
    t.deepEqual(data, {
      'lorem': 'ipsum'
    })
  })
  job.on('end', t.end)
})
