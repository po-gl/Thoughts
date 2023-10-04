import { Router } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mapRoutes from './maps.js';
import mlRoutes from './ml.js';

const routes: Router = Router();
routes.use(cookieParser());
routes.use(bodyParser.json());

routes.use(mapRoutes);
routes.use(mlRoutes);

routes.get('/', async (_req, res) => {
  const routesList = [ mapRoutes, mlRoutes ];
  const routeEndpoints = routesList
    .flatMap((route) => route.stack)
    .map((layer) => layer.route)
    .filter((route) => route !== undefined)
    .map((route) => {
      return {
        endpoint: route.path,
        methods: route.methods,
      };
    });
  res.json({ endpoints: routeEndpoints });
});

export default routes;
