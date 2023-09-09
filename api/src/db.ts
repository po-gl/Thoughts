import dotenv from 'dotenv';
import { Db, MongoClient } from 'mongodb';

dotenv.config();

let db: Db;

async function connectToDB() {
  const uri = process.env.MONGO_DB_URI || 'mongodb://localhost/thoughtorganizer';
  const client = new MongoClient(uri);
  await client.connect();
  console.log(`Connected to MongoDB at ${uri}`);
  db = client.db('thoughtorganizer');
}

function getDB() {
  return db;
}

export { connectToDB, getDB };
