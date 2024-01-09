import { Router } from 'express';
import mindmap, { MindMap } from '../mindmap.js';

const routes = Router();

routes.get('/maps', async (req, res) => {
  try {
    const user = req.credentials.identifier as string;
    const maps = await mindmap.list(user);
    res.send(maps);
  } catch (e) {
    res.json({ error: 'Unable to get maps' });
  }
});

routes.post('/maps', async (req, res) => {
  try {
    const map = req.body.mindmap as MindMap;
    const user = req.credentials.identifier as string;
    const savedMap = await mindmap.add(map, user);
    res.json({ savedMap });
  } catch (e) {
    res.json({ error: 'Unable to save map' });
  }
});

routes.get('/maps/:id', async (req, res) => {
  try {
    const user = req.credentials.identifier as string;
    const map = await mindmap.get(req.params.id, user);
    res.send(map);
  } catch (e) {
    res.json({ error: `Unable to get map with id: ${req.params.id}` });
  }
});

routes.put('/maps/:id', async (req, res) => {
  try {
    const map = req.body.mindmap as MindMap;
    const user = req.credentials.identifier as string;
    const updatedMap = await mindmap.update(req.params.id, map, user);
    res.send(updatedMap);
  } catch (e) {
    res.status(500).json({ error: `Unable to update map with id: ${req.params.id}` });
  }
});

routes.delete('/maps/:id', async (req, res) => {
  try {
    const user = req.credentials.identifier as string;
    const wasDeleted = await mindmap.delete(req.params.id, user);
    res.send(wasDeleted);
  } catch (e) {
    res.status(500).json({ error: `Unable to delete map with id: ${req.params.id}` });
  }
});

export default routes;
