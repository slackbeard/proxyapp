import { Request, Response as ExResponse } from 'express';
import fetch from 'node-fetch';
import { CacheAdapter } from '../cache/adapters/base';
import { CacheKey } from '../cache/cache-key';
import { CacheEntry } from '../cache/cache-entry';
import { runRequestHandlers } from '../request-handler';
import { runResponseHandlers } from '../response-handler';


export async function proxyHandler(req: Request, res: ExResponse) {
    let fullUrl = `${req.protocol}://${req.hostname}${req.url}`;
    console.log(`Proxying for URL: ${fullUrl}`);

    const cacheClient = req.app.get("cacheClient") as CacheAdapter;

    // cacheKey can be updated by custom handlers
    let cacheKey = new CacheKey();

    // Call all custom request handlers
    // If any handler returns false, the cache lookup is skipped
    let cacheLookup: boolean = await runRequestHandlers(fullUrl, cacheKey, req, cacheClient);

    console.log(`Final cache key: ${cacheKey.toString()}`);

    let cacheEntry: CacheEntry | undefined;
    if (cacheLookup) {
        cacheEntry = await cacheClient.getEntry(cacheKey);
    }

    // if we failed to get the object from the cache, fetch from the upstream:
    if (!cacheEntry) {

        // mirror the incoming method
        const fetchOptions: any = {
            method: req.method,
        };

        // copy the body if there is one
        if (req.body.length) {
            fetchOptions['body'] = req.body;
        }

        const response = await fetch(fullUrl, fetchOptions);
        console.log(`Got response from upstream: ${response.status} ${response.statusText}`)

        cacheEntry = await CacheEntry.fromResponse(response);

        let cacheStore: boolean = await runResponseHandlers(fullUrl, req, response);

        if (cacheStore) {
            // store in cache:
            await cacheClient.setEntry(cacheKey, cacheEntry);
        }

    }


    // build response:
    for (let header of cacheEntry.headers) {
        res.setHeader(header[0], header[1]);
    }
    res.status(cacheEntry?.status);
    res.send(cacheEntry?.body);

};
