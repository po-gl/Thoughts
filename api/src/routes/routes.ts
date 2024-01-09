import { Router } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import authRoutes from './auth.js';
import mapRoutes from './maps.js';
import mlRoutes from './ml.js';
import { mustBeSignedIn } from '../auth.js';

const routes: Router = Router();
routes.use(cookieParser());
routes.use(bodyParser.json());

routes.use(authRoutes);
routes.use(mlRoutes);

routes.use(mustBeSignedIn);
routes.use(mapRoutes);

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
