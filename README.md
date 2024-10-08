# Proxy App
A simple caching, configurable proxy app.

## To run locally:
```
$ npm i
...
$ docker-compose build
...
$ docker-compose up
```

At this point the server should be listening on http://localhost:8080

## Examples:

A simple GET request:
```
$ curl -i -H "Host: www.bchance.net" --resolve www.bchance.net:8080:127.0.0.1 "http://www.bchance.net:8080/index.html
```

A simple POST request:
```
$ curl -X POST --data "blah" -i -H "Host: postman-echo.com" --resolve postman-echo.com:8080:127.0.0.1 "http://postman-echo.com:8080/post"
```


## Default behavior
By default the proxy applies the following caching rules:
* Incoming requests are cached by their full URL
* Non-GET methods are not cached
* Authorized requests are not cached
* Non-200 responses are not cached

*For more info see [handlers/request](handlers/request) and [handlers/response](handlers/response).*

## Customization
The caching rules can be extended by adding custom request and response handlers.

Custom request and response handlers can be added in the [config.ts](config.ts) file.

Each handler listed in the config should correspond to a module located in [handlers/request](handlers/request) or [handlers/response](handlers/response).

## Cache storage
The cache storage can be customized in the [config.ts](config.ts) file by specifying a `cacheAdapter`, which should be the name of a module in [lib/cache](lib/cache).

The default cache adapter uses a Redis backend that is configured in the [docker-compose file](docker-compose.yml).