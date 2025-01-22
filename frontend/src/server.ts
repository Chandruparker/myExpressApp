import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios'; // Import axios

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Serve static files from the browser dist folder
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Prerendering function to fetch the product IDs for prerendering
const getPrerenderParams = async (url: string) => {
  if (url.startsWith('/items/view')) {
    try {
      // Fetch product IDs using axios
      const response = await axios.get('http://localhost:3000/api/items/productIds'); // Replace with your API endpoint
      const productIds = response.data;

      // Return the prerender routes
      return productIds.map((productId: number) => ({
        route: `/items/view/${productId}`,
      }));
    } catch (error) {
      console.error('Error fetching productIds for prerendering:', error);
      return []; // Return empty array in case of an error
    }
  }
  return []; // Default case
};

// Handle dynamic routes with SSR
app.get('/items/edit/:productId', async (req, res, next) => {
  try {
    const prerenderRoutes = await getPrerenderParams(req.url); // Get prerender routes
    if (prerenderRoutes.length) {
      // If prerender routes are found, handle them
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

// Catch-all handler for all other routes
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// Start the server
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Export the request handler for use with Angular CLI during dev and build
export const reqHandler = createNodeRequestHandler(app);
