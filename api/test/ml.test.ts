import { jest, describe, expect, test, beforeEach } from '@jest/globals';
import ml from '../src/ml.js';

beforeEach(() => {
  const spy = jest.spyOn(ml, 'getOpenAI');
  // @ts-ignore
  spy.mockImplementation(() => {
    const payload = `{
      "nodes": [ { "id": 1, "text": "test" }, { "id": 2, "text": "jest" }, { "id": 3, "text": "best" } ],
      "edges": [ { "source_id": 1, "target_id": 2, "justification": "testing" }, { "source_id": 1, "target_id": 3, "justification": "" } ]
    }`
    return { chat: { completions: { create: async () => { return { choices: [{ message: { function_call: { arguments: payload } } }], } }, }, }, };
  });
});

describe('ml module', () => {

  describe('generating mind maps', () => {

    test('a valid generation does not throw', async () => {
      const map = await ml.generateMindmap(['test', 'jest']);
      expect(typeof map).toBe('string');
    });

    test('an invalid generation throws', async () => {
      const spy = jest.spyOn(ml, 'getOpenAI');
      // @ts-ignore
      spy.mockImplementation(() => {
        const payload = '{ "malformed": "json }'
        return { chat: { completions: { create: async () => { return { choices: [{ message: { function_call: { arguments: payload } } }] } } } } }
      });

      await expect(() => ml.generateMindmap([])).rejects.toThrowError(/JSON/);
    });
  });
});
