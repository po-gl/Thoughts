import { Router } from 'express';
import ml from '../ml.js';

const routes: Router = Router();

routes.post('/ml/generate-mindmap', async (req, res) => {
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
    res.json({ error: 'Generated invalid JSON' });
  }
});

routes.get('/ml/test', async (_req, res) => {
  try {
    const message = await ml.test();
    res.send(message);
  } catch (e) {
    res.status(500).send('Error generating message');
  }
});

export default routes;
