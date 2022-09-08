export class CacheKey {

    public keyvalues: any = {};

    public update(key: string, value: string) {
        this.keyvalues[key] = value;
    }

    public toString() {
        let sortedKeys = Object.keys(this.keyvalues).sort();
        let sortedEntries = sortedKeys.map(k => [k, this.keyvalues[k]]);
        return JSON.stringify(sortedEntries);
    }

}