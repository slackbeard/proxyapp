import { default as express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { getCacheClient } from './lib/cache/client';
import { proxyHandler } from './lib/routes/proxy';
import { loadCustomRequestHandlers } from './lib/request-handler';
import { loadCustomResponseHandlers } from './lib/response-handler';

const app = express();

app.use(bodyParser.raw({ type: "*/*" }));

app.all(/.*/, async (req: Request, res: Response, next: any) => {
    try {
        await proxyHandler(req, res);
    } catch (err: any) {
        next(err);
    }
});

app.use((err: any, req: Request, res: Response, next: any) => {
    console.warn(`Error: ${err}`);
    return res.status(500).json({
        error: err.toString(),
    });
});

(async () => {
    let cacheClient = await getCacheClient();
    await cacheClient.connect();
    app.set("cacheClient", cacheClient);

    await loadCustomRequestHandlers();
    await loadCustomResponseHandlers();

    app.listen(8080, () => {
        console.log(`Listening ... `)
    });

})();