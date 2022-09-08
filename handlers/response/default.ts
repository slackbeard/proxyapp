import { Request } from 'express';
import { Response } from 'node-fetch';
import { responseHandler } from '../../lib/response-handler';

// Default handler to make non-200 codes skip the cache
responseHandler(/.*/, async (match: RegExpExecArray, req: Request, res: Response) => {

    if (res.status != 200) {
        console.log(`Default response handler: skipping cache for status ${res.status}`);
        return false
    }

    console.log(`Default response handler: status OK ${res.status}`);
    return true;
});