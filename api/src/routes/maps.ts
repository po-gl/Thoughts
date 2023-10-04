import { Router } from 'express';
import mindmap, { MindMap } from '../mindmap.js';

const routes = Router();

routes.get('/maps', async (req, res) => {
  try {
    const user = req.cookies.user;
    if (user === undefined) {
      res.cookie('user', 'tester');
    }
    const maps = await mindmap.list(user);
    res.send(maps);
  } catch (e) {
    res.json({ error: 'Unable to get maps' });
  }
});

routes.post('/maps', async (req, res) => {
  try {
    const map = req.body.mindmap as MindMap;
    const savedMap = await mindmap.add(map);
    res.json({ savedMap });
  } catch (e) {
    res.json({ error: 'Unable to save map' });
  }
});

routes.get('/maps/:id', async (req, res) => {
  try {
    const map = await mindmap.get(req.params.id);
    res.send(map);
  } catch (e) {
    res.json({ error: `Unable to get map with id: ${req.params.id}` });
  }
});

routes.put('/maps/:id', async (req, res) => {
  try {
    const map = req.body.mindmap as MindMap;
    const updatedMap = await mindmap.update(req.params.id, map);
    res.send(updatedMap);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: `Unable to update map with id: ${req.params.id}` });
  }
});

routes.delete('/maps/:id', async (req, res) => {
  try {
    const wasDeleted = await mindmap.delete(req.params.id);
    res.send(wasDeleted);
  } catch (e) {
    res.status(500).json({ error: `Unable to delete map with id: ${req.params.id}` });
  }
});

export default routes;
