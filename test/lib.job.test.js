/*
 * persist.js - lib.job.test.js
 * Copyright(c) 2017 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

'use strict'

const test = require('ava')
const simpleJob = require('./fixture/simple_job')
const Job = require('../lib/job')

let lorem = {
  id: 1,
  payload: {
    ipsum: 'ipsum'
  },
  type: 'simple_job'
}

var job = new Job(lorem)

test('should new a Job', t => {
  t.is(job.id, 1)
  t.is(job.type, lorem.type)
  t.is(job.state, 'pending')
  t.not(job.hash, undefined)
  t.not(job.created_at, undefined)
})

test.cb('should process a task.', t => {
  t.plan(2)

  job.process(simpleJob, function(err, data) {
    t.is(err, null)
    t.deepEqual(data, lorem.payload)
    t.end()
  })
})

test('should export json.', t => {
  var json = job.toJSON()
  t.is(job.id, json.id)
})

test('should export string.', t => {
  var string = job.toString()
  t.is(job.id, JSON.parse(string).id)
})
