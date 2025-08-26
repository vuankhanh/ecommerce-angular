import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { SSR_LANG } from './src/app/sharing/constant/injection_token.constant';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../../browser');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    let lang = 'vi';
    let newOriginalUrl = originalUrl;

    const splitUrl = originalUrl.split('/');
    if (['vi', 'en', 'ja'].includes(splitUrl[1])) {
      lang = splitUrl[1];
      splitUrl.splice(1, 1); // Xóa phần tử ở vị trí 1 (phần tử thứ 2)
      newOriginalUrl = splitUrl.join('/') || '/';
    }
    const indexHtml = join(serverDistFolder, '..', lang, 'index.server.html');

    // SSR cho mọi route (trừ file tĩnh)
    commonEngine.render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${newOriginalUrl}`,
      publicPath: browserDistFolder,
      providers: [
        { provide: APP_BASE_HREF, useValue: baseUrl },
        { provide: SSR_LANG, useValue: lang }
      ],
    }).then((html) => res.send(html)).catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
