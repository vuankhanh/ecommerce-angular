import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import fs from 'fs';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // Đọc danh sách route tĩnh từ prerendered-routes.json
  const prerenderedRoutes = JSON.parse(
    fs.readFileSync(join(browserDistFolder, '../prerendered-routes.json'), 'utf-8')
  ).routes;

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { path, protocol, originalUrl, baseUrl, headers } = req;

    const langMatch = req.path.match(/^\/(vi|en|ja)(\/|$)/);
    const lang = langMatch ? langMatch[1] : 'vi';
    const indexHtmlPath = join(browserDistFolder, lang, 'index.html');

    if (prerenderedRoutes[path]) {
      commonEngine
        .render({
          bootstrap,
          documentFilePath: indexHtml,
          url: `${protocol}://${headers.host}${originalUrl}`,
          publicPath: browserDistFolder,
          providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
        })
        .then((html) => res.send(html))
        .catch((err) => next(err));
    } else {
      // Fallback về client-side
      res.sendFile(indexHtmlPath, (err) => {
        if (err) next(err);
      });
    }
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
