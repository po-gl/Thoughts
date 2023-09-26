import { Router } from 'express';
import mindmap, { MindMap } from './mindmap.js';
import ml from './ml.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const routes: Router = Router();
routes.use(cookieParser());
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

routes.get('/maps', async (req, res) => {
  try {
    const user = req.cookies.user;
    const maps = await mindmap.list(user);
    res.send(maps);
  } catch (e) {
    res.json({ error: 'Unable to get maps' });
  }
});

routes.post('/maps', async (req, res) => {
  try {
    const map = req.body.mindmap as MindMap;
    await mindmap.add(map);
    res.json({ status: 'ok' });
  } catch (e) {
    res.json({ error: 'Unable to save map' });
  }
});

routes.get('/maps/:id', async (req, res) => {
  try {
    const map = await mindmap.get(req.params.id);
    res.send(map);
  } catch (e) {
    res.json({ error: `Unable to get map with id: ${req.params.id}` })
  }
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
    res.json({ error: 'Generated invalid JSON' })
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
