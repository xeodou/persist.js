/*
 * persist.js - simple_job.js
 * Copyright(c) 2017 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

'use strict'

module.exports = function (job, done) {
  done(null, job.payload)
}
