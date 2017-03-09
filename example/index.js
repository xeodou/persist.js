/*
 * persist.js - index.js
 * Copyright(c) 2017 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

/* global XMLHttpRequest */

'use strict'

const Persist = require('../lib')

const instance = Persist.instance()

instance.register('http', function (job, done) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', 'https://api.github.com/users/xeodou')
  xhr.onload = function () {
    done(null, JSON.parse(xhr.responseText))
  }
  xhr.onerror = done
  xhr.send()
})

window.fire = function fire () {
  var job = instance.createJob('http', {})
  job.on('start', function () {
    document.getElementById('output').appendChild(document.createTextNode('Start'))
  })

  job.on('data', function (data) {
    document.getElementById('output').appendChild(document.createTextNode(data.name))
  })

  job.on('end', function () {
    document.getElementById('output').appendChild(document.createTextNode('End'))
  })
}
