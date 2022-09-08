import { createClient, RedisClientType } from 'redis';
import config from '../../../config';
import { CacheAdapter } from './base';

export default class RedisAdapter extends CacheAdapter {
    public client: RedisClientType<any>;

    constructor() {
        super();
        this.client = createClient({
            'socket': {
                host: config.redis.host,
            }
        });

    }
    async connect() {
        return await this.client.connect();
    }

    async get(key: any) {
        return await this.client.get(key);
    }

    async set(key: any, value: any) {
        return await this.client.set(key, value);
    }

    async del(key: any) {
        return await this.client.del(key);
    }
}
