import { Router } from 'express';
import mindmap from './mindmap.js';
import ml from './ml.js';
import bodyParser from 'body-parser';

const routes: Router = Router();
routes.use(bodyParser.json());

routes.get('/', async (req, res) => {
  const route_endpoints = routes.stack
    .map((layer) => layer.route)
    .filter((route) => route !== undefined)
    .map((route) => {
      return {
        endpoint: route.path,
        methods: route.methods
      }
    })
  res.json({ endpoints: route_endpoints });
});

routes.post('/maps', async (req, res) => {
  const maps = await mindmap.list(req.body.user);
  res.send(maps);
});

routes.get('/maps/:id', async (req, res) => {
  const map = await mindmap.get(req.params.id);
  res.send(map);
});

routes.post('/generate-mindmap', async (req, res) => {
  const thoughts: string[] = req.body.thoughts;
  const mapSize: number = req.body.mapSize;
  if (thoughts === undefined || mapSize === undefined) {
    res.status(400).send('Bad Request');
    return;
  }

  try {
    const map = await ml.generateMindmap(thoughts, mapSize);
    res.send(map);
  } catch (e) {
    res.send({ 'error': 'Generated invalid JSON' })
  }
});

routes.get('/ml/test', async (req, res) => {
  try {
    const message = await ml.test();
    res.send(message);
  } catch (e) {
    res.status(500).send('Error generating message');
  }
});

export default routes;
