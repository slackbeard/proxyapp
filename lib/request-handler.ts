import { CacheKey } from './cache/cache-key';
import { CacheAdapter } from './cache/adapters/base';
import { Request } from 'express';
import config from '../config';

export type RequestHandlerFn = (urlMatch: RegExpExecArray, key: CacheKey, req: Request, cache: CacheAdapter) => any;

/**
 * Custom request handler
 */
export class RequestHandler {

    // pattern to match against full incoming URL 
    pattern: RegExp = /.*/;

    // handler can be any function for now
    handlerFn: RequestHandlerFn = () => { };

    constructor(pattern: any, handler: any) {
        this.pattern = pattern;
        this.handlerFn = handler;
    }

}

let allRequestHandlers: RequestHandler[] = [];

/**
 * Add a custom request handler
 * 
 * Example:
 * requestHandler(/signup/, async (match: RegExpExecArray, key: CacheKey, req: Request) => {
 *     let sessionId = req.header("x-session-id")
 *     await key.update("sessionId", sessionId);
 *     return true;
 * });
 * 
 * @param pattern regex to match against full incoming URL
 * @returns original function
 */
export function requestHandler(pattern: RegExp, innerFn: RequestHandlerFn) {
    allRequestHandlers.push(new RequestHandler(pattern, innerFn));
    return innerFn;
}

export function getRequestHandlers(): RequestHandler[] {
    return allRequestHandlers;
}

export async function runRequestHandlers(url: string, key: CacheKey, req: Request, cache: CacheAdapter) {

    console.log(`Total request handlers: ${allRequestHandlers.length}`);

    for (let handler of allRequestHandlers) {

        console.log(`Checking handler for ${handler.pattern} against url: ${url}`);

        const matches = handler.pattern.exec(url);

        if (matches) {
            console.log(`Matched handler for ${handler.pattern}`);
            const success = await handler.handlerFn(matches, key, req, cache);
            if (!success) {
                return false;
            }
        }
    }
    return true;
}

export async function loadCustomRequestHandlers() {
    const moduleNames = config.requestHandlers;
    for (let moduleName of moduleNames) {

        // handler modules use `requestHandler()` to register custom handlers:
        await import('../handlers/request/' + moduleName);
    }
}


