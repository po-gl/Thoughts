import { Router } from 'express';
import mindmap from './mindmap.js';
import ml from './ml.js';
import bodyParser from 'body-parser';

const routes: Router = Router();
routes.use(bodyParser.json());

routes.put('/map', async (req, res) => {
  res.send('Hia there');
});

routes.get('/map/:id', async (req, res) => {
  const map = await mindmap.get(req.params.id);
  res.send(map);
});

routes.post('/generate-mindmap', async (req, res) => {
  console.log(req);
  const thoughts: string[] = req.body.thoughts;
  if (thoughts === undefined) {
    res.status(400).send('Bad Request');
    return;
  }
  const response = await ml.generateMindmap(thoughts);
  const map = response.choices[0].message.function_call?.arguments;

  try {
    JSON.parse(map as string);
  } catch (e) {
    res.status(500).send({ 'error': 'Generated invalid JSON' })
  }

  res.send(map);
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
