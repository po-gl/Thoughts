import express from 'express';
import dotenv from 'dotenv';
import { connectToDB, getDB } from './db.js';
import getOpenAI from './ml.js';
import routes from './routes.js';

dotenv.config();

const app = express();

app.get('/', async (req, res) => {
  const db = getDB();
  const maps = await db.collection('maps').find({}).toArray();
  res.send(maps);
});

app.get('/openai', async (req, res) => {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test and then name a random animal' }],
    model: 'gpt-3.5-turbo',
  });
  res.send(completion.choices);
});

app.use(routes);

const port = process.env.API_PORT || 3000;
async function start() {
  try {
    await connectToDB();

    app.listen(port, () => {
      console.log(`API server listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
