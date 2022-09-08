import { Request } from 'express';
import { CacheKey } from '../../lib/cache/cache-key';
import { requestHandler } from '../../lib/request-handler';

// Default handler for skipping authorized requests
requestHandler(/.*/, async (match: RegExpExecArray, key: CacheKey, req: Request) => {

    if (req.header("authorization")) {
        return false;
    }

    return true;
});