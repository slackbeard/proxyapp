import { Request } from 'express';
import { Response } from 'node-fetch';
import config from '../config';

export type ResponseHandlerFn = (urlMatch: RegExpExecArray, req: Request, res: Response) => any;

/**
 * Custom response handler
 */
export class ResponseHandler {

    // pattern to match against full incoming URL 
    pattern: RegExp = /.*/;

    // handler can be any function for now
    handlerFn: ResponseHandlerFn = () => { };

    constructor(pattern: any, handler: any) {
        this.pattern = pattern;
        this.handlerFn = handler;
    }

}

let allResponseHandlers: ResponseHandler[] = [];

/**
 * Add a custom response handler
 * 
 * @param pattern regex to match against full incoming URL
 * @returns original function
 */
export function responseHandler(pattern: RegExp, innerFn: ResponseHandlerFn) {
    allResponseHandlers.push(new ResponseHandler(pattern, innerFn));
    return innerFn;
}

export function getResponseHandlers(): ResponseHandler[] {
    return allResponseHandlers;
}

export async function runResponseHandlers(url: string, req: Request, res: Response) {

    console.log(`Total response handlers: ${allResponseHandlers.length}`);

    for (let handler of allResponseHandlers) {

        console.log(`Checking handler for ${handler.pattern} against url: ${url}`);

        const matches = handler.pattern.exec(url);

        if (matches) {
            console.log(`Matched handler for ${handler.pattern}`);
            const success = await handler.handlerFn(matches, req, res);
            if (!success) {
                return false;
            }
        }
    }
    return true;
}

export async function loadCustomResponseHandlers() {
    const moduleNames = config.responseHandlers;
    for (let moduleName of moduleNames) {

        // handler modules use `responseHandler()` to register custom handlers:
        await import('../handlers/response/' + moduleName);
    }
}


