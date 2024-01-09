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
};

async function list(user: string) {
  const db = getDB();
  const mindMaps = await db.collection('maps').find({ user }).toArray();
  return mindMaps;
}

async function get(id: string, user: string) {
  const db = getDB();
  const objectId = new ObjectId(id);
  const mindMap = await db.collection('maps').findOne({ _id: objectId, user });
  return mindMap;
}

function validate(mindmap: MindMap) {
  if (mindmap.user === undefined) throw new Error('user is a required field');
  JSON.parse(mindmap.graph);
}

async function add(mindmap: MindMap, user: string) {
  const db = getDB();
  const newMindmap = { ...mindmap };
  newMindmap.user = user;
  newMindmap.created = new Date();
  newMindmap.modified = new Date();
  if (newMindmap.title === undefined) newMindmap.title = 'New Mindmap';
  if (newMindmap.description === undefined) newMindmap.description = '';

  validate(newMindmap);
  const result = await db.collection('maps').insertOne(newMindmap);
  const savedMindmap = await db.collection('maps').findOne({ _id: result.insertedId, user });
  return savedMindmap;
}

async function update(id: string, mindmap: MindMap, user: string) {
  const db = getDB();
  const objectId = new ObjectId(id);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { _id: _, ...mindmapWithoutId } = mindmap;
  mindmapWithoutId.user = user;

  validate({ _id: objectId, ...mindmapWithoutId });
  await db.collection('maps').updateOne({ _id: objectId, user }, { $set: mindmapWithoutId });
  const savedMindmap = await db.collection('maps').findOne({ _id: objectId, user });
  return savedMindmap;
}

async function remove(id: string, user: string) {
  const db = getDB();
  const objectId = new ObjectId(id);
  const mindMap = await db.collection('maps').findOne({ _id: objectId, user });
  if (!mindMap) return false;

  mindMap.deleted = new Date();

  const result = await db.collection('deleted_maps').insertOne(mindMap);
  if (result.insertedId) {
    const deletedResult = await db.collection('maps').deleteOne({ _id: objectId, user });
    return deletedResult.deletedCount === 1;
  }
  return false;
}

async function restore(id: string, user: string) {
  const db = getDB();
  const objectId = new ObjectId(id);
  const mindMap = await db.collection('deleted_maps').findOne({ _id: objectId, user });
  if (!mindMap) return false;

  const result = await db.collection('maps').insertOne(mindMap);
  if (result.insertedId) {
    const deletedResult = await db.collection('deleted_maps').deleteOne({ _id: objectId, user });
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
