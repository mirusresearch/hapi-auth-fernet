'use strict'

import test from 'ava'

const fernet = require('fernet')
const auth = require('../lib/index.js')

test.beforeEach(t => {
    let fakeServer = {
        auth: {
            scheme(name, imp) {
                t.context.implementation = imp
            }
        }
    }

    auth.plugin.register(fakeServer)
    t.context.secret = 'FlQQ04eEfd7dP7E6a5QfuHrxv1HceYYyvQFsBQ02f1Y='
})

test('throw error when missing secret option', t => {
    let err1 = t.throws(() => t.context.implementation({}), Error)
    let err2 = t.throws(() => t.context.implementation({}, {}), Error)
    let err3 = t.throws(() => t.context.implementation({}, { a: 'b' }), Error)

    t.is(err1.message, 'missing fernet secret')
    t.is(err2.message, 'missing fernet secret')
    t.is(err3.message, 'missing fernet secret')
})

test('authenticate | throw error when no x-token', async t => {
    let imp = t.context.implementation({}, { secret: t.context.secret })
    let err = await t.throws(imp.authenticate({ headers: {} }, {}))
    t.is(err.message, 'no x-token header provide')
})

test('authenticate | throw error on bad x-token', async t => {
    let imp = t.context.implementation({}, { secret: t.context.secret })
    let err = await t.throws(imp.authenticate({ headers: { 'x-token': 'no good' } }, {}))
    t.is(err.message, 'bad x-token header')
})

test('authenticate | good x-token', async t => {
    let secret = new fernet.Secret(t.context.secret)
    let token = new fernet.Token({ secret })
    let x_token = token.encode('message')
    let imp = t.context.implementation({}, { secret: t.context.secret })
    let response = await imp.authenticate(
        { headers: { 'x-token': x_token } },
        { authenticated: obj => obj }
    )

    t.deepEqual(response, { credentials: { isValid: true } })
})
