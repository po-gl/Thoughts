import { ObjectId } from 'mongodb';
import { getDB } from './db.js';

export type MindMap = {
  _id: ObjectId;
  user: string;
  created: Date;
  modified: Date;
  deleted?: Date;
  title: string;
  description: string;
  graph: string;
}

async function list(user: string) {
  const db = getDB();
  const mindMaps = await db.collection('maps').find({ user }).toArray();
  return mindMaps;
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

async function remove(id: string) {
  const db = getDB();
  const objectId = new ObjectId(id);
  const mindMap = await db.collection('maps').findOne({ _id: objectId });
  if (!mindMap) return false;

  mindMap.deleted = new Date();

  const result = await db.collection('deleted_maps').insertOne(mindMap);
  if (result.insertedId) {
    const deletedResult = await db.collection('maps').deleteOne({ _id: objectId });
    return deletedResult.deletedCount === 1;
  }
  return false;
}

async function restore(id: string) {
  const db = getDB();
  const objectId = new ObjectId(id);
  const mindMap = await db.collection('deleted_maps').findOne({ _id: objectId });
  if (!mindMap) return false;

  const result = await db.collection('maps').insertOne(mindMap);
  if (result.insertedId) {
    const deletedResult = await db.collection('deleted_maps').deleteOne({ _id: objectId });
    return deletedResult.deletedCount === 1;
  }
  return false;
}

export default {
  list,
  get,
  add,
  update,
  delete: remove,
  restore,
  validate,
};
