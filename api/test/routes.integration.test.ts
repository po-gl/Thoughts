import { test, expect, describe, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app, start, close } from '../src/server.js';
import { getDB } from '../src/db.js';
import { ObjectId } from 'mongodb';
import { response } from 'express';


const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
function dateReviver(key: string, value: string) {
  return isoDateRegex.test(value) ? new Date(value) : value
}

describe('integration for routes module', () => {

  beforeAll(async () => {
    await start();
  });

  afterAll(async () => {
    await close();
  })

  test('should return a expected list of endpoints for GET /', async () => {
    const response = await request(app).get('/');
    const body = response.text;
    const result = JSON.parse(body);
    expect(result.endpoints.length).toBeGreaterThan(0);

    const expectedEndpoints = [
      "/maps",
      "/maps/:id",
      "/generate-mindmap",
      "/ml/test",
    ]
    const actualEndpoints = result.endpoints.map((e) => e.endpoint)

    for (const endpoint of expectedEndpoints) {
      expect(actualEndpoints).toContain(endpoint)
    }
  });

  describe('maps routes', () => {

    test('should get a list of mindmaps for GET /maps given an existing user', async () => {
      const response = await request(app).post('/maps').send({ user: 'tester' });
      const body = response.text;
      const result = JSON.parse(body, dateReviver);

      expect(result.length).toBe(2);
      expect(result[1].user).toBe('tester');
    });

    test('should get an empty list for GET /maps on a non-existing user', async () => {
      const response = await request(app).post('/maps').send({ user: 'no tester' });
      const body = response.text;
      const result = JSON.parse(body, dateReviver);
      expect(result.length).toBe(0);
    });

    test('should return a specific mindmap for GET /maps/:id', async () => {
      const db = getDB();
      const mindmap = await db.collection('maps').findOne({ user: 'tester' });
      const id = mindmap?._id.toString();

      const response = await request(app).get(`/maps/${id}`);
      const body = response.text;
      const result = JSON.parse(body, dateReviver);
      result._id = new ObjectId(result._id);

      expect(result).toEqual(mindmap);
    });
  });

  describe('ML generation routes', () => {

    test('should a generated string from OpenAI API for GET /ml/test', async () => {
      const response = await request(app).get('/ml/test');
      const message = response.text;
      expect(message).toBe('This is a test.');
    })

    test('should get a generated a graph from OpenAI API for POST /generate-mindmap', async () => {
      const response = await request(app).post('/generate-mindmap').send({ thoughts: ['test'], mapSize: 2 });
      const body = response.text;
      const result = JSON.parse(body);

      expect(result.error).toBeUndefined();
      expect(result.nodes.length).toBeGreaterThanOrEqual(2);
      expect(result.edges.length).toBeGreaterThan(1);
    }, 20000);

    test('should get Bad Request for undefined body for POST /generate-mindmap', async () => {
      const response = await request(app).post('/generate-mindmap');
      const result = response.text;

      expect(response.statusCode).toBe(400);
      expect(result).toBe('Bad Request');
    });
  });
});