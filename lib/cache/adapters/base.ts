import { CacheEntry } from "../cache-entry";
import { CacheKey } from "../cache-key";

/**
 * Base class for cache adapter
 */
export abstract class CacheAdapter {
    abstract connect(): any;
    abstract get(key: any): any;
    abstract set(key: any, value: any): any;
    abstract del(key: any): any;


    async getEntry(cacheKey: CacheKey): Promise<CacheEntry | undefined> {

        let key = cacheKey.toString();

        let cacheObject = await this.get(key);
        if (cacheObject) {
            console.log(`Checking cache for key: ${key} => HIT`);
            try {
                let cacheEntry = JSON.parse(cacheObject) as CacheEntry;
                return cacheEntry;

            } catch (err: any) {
                console.warn(`Failed to parse cache object, removing key '${key}'`);
                await this.del(key);
            }
        } else {
            console.log(`Checking cache for key: ${key} => MISS`);
        }
        // return undefined
    }

    async setEntry(cacheKey: CacheKey, cacheEntry: CacheEntry) {
        await this.set(cacheKey.toString(), JSON.stringify(cacheEntry));
    }
};