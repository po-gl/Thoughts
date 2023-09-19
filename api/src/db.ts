import dotenv from 'dotenv';
import { Db, MongoClient } from 'mongodb';

dotenv.config();

let client: MongoClient;
let db: Db;

async function connectToDB() {
  const uri = process.env.MONGO_DB_URI || 'mongodb://localhost/thoughtorganizer';
  client = new MongoClient(uri);
  await client.connect();
  console.log(`Connected to MongoDB at ${uri}`);
  db = client.db('thoughtorganizer');
}

async function closeConnectionToDB() {
  await client.close();
}

function getDB() {
  return db;
}

export { connectToDB, getDB, closeConnectionToDB };
