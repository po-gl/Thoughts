import { ObjectId } from 'mongodb';
import { getDB } from './db.js';

type MindMap = {
  _id: ObjectId;
  user: string;
  created: Date;
  modified: Date;
  title: string;
  description: string;
  graph: string;
}

async function get(id: string) {
  const db = getDB();
  const objectId = new ObjectId(id);
  const mindMap = await db.collection('maps').findOne({ _id: objectId });
  return mindMap;
}

function validate(mindmap: MindMap) {
  JSON.parse(mindmap.graph);
}

async function add(mindmap: MindMap) {
  const db = getDB();
  validate(mindmap);
  const newMindmap = { ...mindmap };
  newMindmap.created = new Date();
  newMindmap.modified = new Date();

  const result = await db.collection('maps').insertOne(mindmap);
  const savedMindmap = await db.collection('maps').findOne({ _id: result.insertedId });
  return savedMindmap;
}

async function update(id: string, mindmap: MindMap) {
  const db = getDB();
  validate(mindmap);
  const objectId = new ObjectId(id);
  await db.collection('maps').updateOne({ _id: objectId }, { $set: mindmap });
  const savedMindmap = await db.collection('maps').findOne({ _id: objectId });
  return savedMindmap;
}

export default { get, add, update };
