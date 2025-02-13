import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

const getPrerenderParams = async (url: string) => {
  if (url.startsWith('/items/view')) {
    try {
      const response = await axios.get('http://localhost:3000/api/items/productIds');
      const productIds = response.data;
      return productIds.map((productId: number) => ({
        route: `/items/view/${productId}`,
      }));
    } catch (error) {
      console.error('Error fetching productIds for prerendering:', error);
      return []; 
    }
  }
  return []; 
};

app.get('/items/edit/:productId', async (req, res, next) => {
  try {
    const prerenderRoutes = await getPrerenderParams(req.url); 
    if (prerenderRoutes.length) {
    
      angularApp
        .handle(req)
        .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
        .catch(next);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});


app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
