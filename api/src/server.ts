import express from 'express';
import dotenv from 'dotenv';
import { connectToDB } from './db.js';
import routes from './routes.js';

dotenv.config();

const app = express();

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

if (process.env.NODE_ENV !== 'test') {
  start();
}

export { app };