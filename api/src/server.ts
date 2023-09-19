import express from 'express';
import dotenv from 'dotenv';
import { closeConnectionToDB, connectToDB } from './db.js';
import routes from './routes.js';
import { Server } from 'http';

dotenv.config();

const app = express();
let server: Server;

app.use(routes);

const port = process.env.API_PORT || 3000;
async function start() {
  try {
    await connectToDB();

    server = app.listen(port, () => {
      console.log(`API server listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

async function close() {
  await closeConnectionToDB();
  server.close();
}

export { app, start, close };
