import { Request } from 'express';
import { CacheKey } from '../../lib/cache/cache-key';
import { requestHandler } from '../../lib/request-handler';

// Default handler for skipping non-GET methods:
requestHandler(/.*/, async (match: RegExpExecArray, key: CacheKey, req: Request) => {

    if (req.method.toUpperCase() != "GET") {
        console.log(`Request method ${req.method.toUpperCase()} will not be cached`);
        return false;
    }

    return true;
});