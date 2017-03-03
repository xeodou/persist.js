/*
 * persist.js - lib.memory.test.js
 * Copyright(c) 2017 xeodou <xeodou@gmail.com>
 * MIT Licensed
 */

'use strict'

const test = require('ava')
const Memory = require('../lib/memory')

const store = new Memory()

test('should contain storage.', t => {
  t.deepEqual(store._store, {})
})

test('should get nothing from store.', t => {
  t.is(store.get('lorem'), undefined)
})

test('should save data in store.', t => {
  t.is(store.set('lorem', 'ipsum').get('lorem'), 'ipsum')
})

test('should list all data inside store.', t => {
  t.deepEqual(store.all(), {lorem: 'ipsum'})
})

test('should del data in store.', t => {
  t.is(store.del('lorem').get('lorem'), undefined)
})
