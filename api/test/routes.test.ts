import { test, expect, describe } from 'vitest';
import request from 'supertest';
import { app } from '../src/server.js';

describe('routes module', () => {
  test('GET / should return a list of endpoints', async () => {
    const response = await request(app).get('/');
    const body = response.text;
    const result = JSON.parse(body);
    expect(result.endpoints.length).toBeGreaterThan(0);

    const expectedEndpoints = [
      "/map",
      "/map/:id",
      "/generate-mindmap",
      "/ml/test",
    ]
    const actualEndpoints = result.endpoints.map((e) => e.endpoint)

    for (const endpoint of expectedEndpoints) {
      expect(actualEndpoints).toContain(endpoint)
    }
  })
});