import { describe, expect, test } from 'vitest';
import mindmap, { MindMap } from '../src/mindmap.js';
import { ObjectId } from 'mongodb';
import { beforeEach } from 'node:test';

describe('mindmap module', () => {

  describe('validating mindmap', () => {

    const exampleMindmap: MindMap = {
      _id: new ObjectId(),
      user: 'tester',
      created: new Date(),
      modified: new Date(),
      title: 'Test mindmap',
      description: 'a mindmap for testing',
      graph: '',
    };
    beforeEach(() => {
      exampleMindmap.graph = '';
    })

    test('an invalid mindmap throws an error', () => {
      exampleMindmap.graph = '{ "nodes": [] "edges": []}';
      expect(() => mindmap.validate(exampleMindmap)).toThrowError(/JSON/);
    });

    test('a valid mindmap does not throw', () => {
      exampleMindmap.graph = '{ "nodes": [ { "id": 1, "text": "test" }, { "id": 2, "text": "jest" } ], "edges": []}';
      expect(mindmap.validate(exampleMindmap)).toBe(undefined);
    });
  });
});