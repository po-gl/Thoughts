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

routes.put('/map', async (req, res) => {
  res.send('Hia there');
});

routes.get('/map/:id', async (req, res) => {
  const map = await mindmap.get(req.params.id);
  res.send(map);
});

routes.post('/generate-mindmap', async (req, res) => {
  const thoughts: string[] = req.body.thoughts;
  if (thoughts === undefined) {
    res.status(400).send('Bad Request');
    return;
  }

  try {
    const map = await ml.generateMindmap(thoughts);
    res.send(map);

  } catch (e) {
    res.status(500).send({ 'error': 'Generated invalid JSON' })
  }
});

routes.get('/openai/test', async (req, res) => {
  const openai = ml.getOpenAI();
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test and then name a random animal' }],
    model: 'gpt-3.5-turbo',
  });
  res.send(completion.choices);
});

export default routes;
