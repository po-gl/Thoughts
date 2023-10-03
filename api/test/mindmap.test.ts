import { jest, afterAll, beforeAll, beforeEach, afterEach, describe, expect, test } from '@jest/globals';
import { MongoClient, ObjectId, Db } from 'mongodb';
import * as database from '../src/db.js';
import mindmap, { MindMap } from '../src/mindmap.js';

describe('mindmap module', () => {
  let connection: MongoClient;
  let db: Db;

  const spy = jest.spyOn(database, 'getDB');
  spy.mockImplementation(() => db);

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__);
    db = connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('validating mindmaps', () => {
    const exampleMindmap: MindMap = {
      _id: new ObjectId(), user: 'tester',
      created: new Date(), modified: new Date(),
      title: 'Test mindmap', description: 'a mindmap for testing',
      graph: '',
    };

    beforeEach(() => {
      exampleMindmap.graph = '';
    });

    test('should throw for an invalid mindmap', () => {
      exampleMindmap.graph = '{ "nodes": [] "edges": []}'; // Missing comma
      expect(() => mindmap.validate(exampleMindmap)).toThrowError(/JSON/);
    });

    test('should not throw for valid mindmap', () => {
      exampleMindmap.graph = '{ "nodes": [ { "id": 1, "text": "test" }, { "id": 2, "text": "jest" } ], "edges": []}';
      expect(mindmap.validate(exampleMindmap)).toBe(undefined);
    });
  });

  describe('CRUD operations', () => {

    const exampleMindmap: MindMap = {
      _id: new ObjectId(), user: 'tester',
      created: new Date(), modified: new Date(),
      title: 'Test mindmap', description: 'a mindmap for testing',
      graph: '{ "nodes": [], "edges": [] }',
    };

    afterEach(async () => {
      await db.collection('maps').deleteMany();
      await db.collection('deleted_maps').deleteMany();
    });

    test('should get a mind map using id', async () => {
      await db.collection('maps').insertOne(exampleMindmap);
      const id = exampleMindmap._id.toString();

      const foundMindmap = await mindmap.get(id);
      expect(foundMindmap).toEqual(exampleMindmap);
    });

    test('should add a mind map', async () => {
      const addedMindmap = await mindmap.add(exampleMindmap);

      const insertedMindmap = await db.collection('maps').findOne({ user: 'tester' });
      expect(insertedMindmap).toEqual(addedMindmap);
    });

    test('should update a mind map', async () => {
      await db.collection('maps').insertOne(exampleMindmap);
      const id = exampleMindmap._id.toString();

      const updatedMindmap = await mindmap.update(id, { ...exampleMindmap, title: 'Updated title' });
      const foundMindmap = await db.collection('maps').findOne({ _id: exampleMindmap._id });
      expect(foundMindmap).toEqual(updatedMindmap);
    });

    test('should delete a mind map', async () => {
      await db.collection('maps').insertOne(exampleMindmap);
      const id = exampleMindmap._id.toString();

      const result = await mindmap.delete(id);
      expect(result).toBe(true);
      expect(await db.collection('maps').countDocuments()).toBe(0);
      expect(await db.collection('deleted_maps').countDocuments()).toBe(1);
      const deletedMindmap = await db.collection('deleted_maps').findOne({ _id: exampleMindmap._id });
      expect({ ...deletedMindmap, deleted: undefined }).toStrictEqual({ ...exampleMindmap, deleted: undefined });
    });

    test('try to delete a mind map that does not exist', async () => {
      await db.collection('maps').insertOne(exampleMindmap);

      const result = await mindmap.delete((new ObjectId()).toString());
      expect(result).toBe(false);
    });

    test('should restore a mind map', async () => {
      await db.collection('maps').insertOne(exampleMindmap);
      const id = exampleMindmap._id.toString();
      await mindmap.delete(id);

      const result = await mindmap.restore(id);
      expect(result).toBe(true);
      expect(await db.collection('maps').countDocuments()).toBe(1);
      expect(await db.collection('deleted_maps').countDocuments()).toBe(0);
      const restoredMindmap = await db.collection('maps').findOne({ _id: exampleMindmap._id });
      expect({ ...restoredMindmap, deleted: undefined }).toStrictEqual({ ...exampleMindmap, deleted: undefined });
    });

    test('try to restore a mind map that does not exist', async () => {
      await db.collection('maps').insertOne(exampleMindmap);
      const id = exampleMindmap._id.toString();
      await mindmap.delete(id);

      const result = await mindmap.restore((new ObjectId()).toString());
      expect(result).toBe(false);
    });
  });
});
