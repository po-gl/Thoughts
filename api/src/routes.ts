import { Router } from 'express';
import mindmap from './mindmap.js';

const routes: Router = Router();

routes.put('/map', async (req, res) => {
  res.send('Hia there');
});

routes.get('/map/:id', async (req, res) => {
  const map = await mindmap.get(req.params.id);
  res.send(map);
});

export default routes;
