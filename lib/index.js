'use strict'

const Boom = require('boom')
const fernet = require('fernet')

const internals = {
    implementation: function(server, options) {
        if (options === undefined || typeof options.secret !== 'string') {
            throw new Error('missing fernet secret')
        }

        return {
            authenticate: async function(request, h) {
                let x_token = request.headers['x-token']
                if (x_token === undefined || x_token === null) {
                    throw Boom.unauthorized('no x-token header provide')
                }

                try {
                    let secret = new fernet.Secret(options.secret)
                    let token = new fernet.Token({
                        secret,
                        token: x_token,
                        ttl: options.ttl || 300000 // 5 minutes by default
                    })
                    token.decode()

                    return h.authenticated({
                        credentials: { isValid: true }
                    })
                } catch (err) {
                    throw Boom.unauthorized('bad x-token header')
                }
            }
        }
    }
}

exports.plugin = {
    register: function(server) {
        server.auth.scheme('fernet', internals.implementation)
    },
    name: 'fernet-auth'
}
