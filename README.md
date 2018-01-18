![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

A Hapi 17 plugin that uses a fernet created token, created using a shared secret between servers, to authenticate a request. The token is provided in the header  `x-token` of the request. Check out [fernet](https://www.npmjs.com/package/fernet).

```javascript
// generate a token using the secret

let fernet = require('fernet')
let secret = new fernet.Secret('secret-here')
let token = new fernet.Token({ secret })
let xToken = token.encode("the message, maybe a hash if only using this for auth")
```

```javascript
// in the server receiving the request

let server = new Hapi.Server(config)
let authConfig = {
    secret: 'secret-here',
    ttl: 4000 // defaults to 300000, which is 5 minutes
}

await server.register(auth)
await server.auth.strategy('simple', 'fernet', authConfig)
await server.auth.default('simple')

server.route({
    method: 'GET',
    path: '/',
    handler: () => 'hello fernet auth'
})
```


## linting
This project uses [Prettier.js](https://prettier.io/) for code formating and linting. I would recomend installing it globally as described [here](https://prettier.io/docs/en/install.html) and integrate it with your editor.

here is the configuration used

```
--no-semi: true
--single-quote: true
--tab-width: 4
```

check out `.eslint.rc` as well
