export default {
    // "cacheAdapter" should the name of a module located in lib/cache/adapters:
    cacheAdapter: 'redis',
    redis: {
        host: 'redis',
    },

    // "requestHandlers" should be a list of modules located in handlers/request/
    requestHandlers: ["default", "noauth", "onlyget"],

    // "responseHandlers" should be a list of modules located in handlers/response/
    responseHandlers: ["default"]

};