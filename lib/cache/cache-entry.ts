import { Response } from 'node-fetch';
export class CacheEntry {
    status: number = 0;
    headers: string[][] = [];
    body: any;

    // TODO: Other metadata? e.g. reference to external storage if `body` is too big for redis?

    /**
     * Build a CacheEntry from a Response object 
     * 
     * @param response 
     */
    static async fromResponse(response: Response) {
        let cacheEntry = new CacheEntry();

        cacheEntry.status = response.status;
        for (let header of response.headers.entries()) {
            cacheEntry.headers.push([header[0], header[1]]);
        }
        cacheEntry.body = await response.text();

        return cacheEntry;
    }

}