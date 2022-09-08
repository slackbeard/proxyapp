import config from '../../config';
import { CacheAdapter } from './adapters/base';

let cacheClient!: CacheAdapter;

export async function getCacheClient() {
    if (cacheClient) {
        return cacheClient;
    }

    const adapterName = config.cacheAdapter;
    console.log(`Loading dynamic adapter: '${adapterName}'`);

    const adapterModule = await import('./adapters/' + adapterName)
    cacheClient = new adapterModule.default();
    return cacheClient;
}


