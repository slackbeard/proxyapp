import { CacheKey } from '../../lib/cache/cache-key';
import { requestHandler } from '../../lib/request-handler';

// Default handler for setting the cache key to the full URL
requestHandler(/.*/, async (match: RegExpExecArray, key: CacheKey) => {

    console.log(`Default request handler adding full url to cache key: ${match[0]}`);
    await key.update("url", match[0]);

    return true;
});