/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import ml from './ml.js';

dotenv.config();

let openai: OpenAI;
const model = 'gpt-4-0613';

const mindmapSchema = {
  "type": "object",
  "properties": {
    "nodes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string" },
          "thought": { "type": "string" },
        },
        "required": ["id", "thought"],
      },
    },
    "edges": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "justification": { "type": "string" },
          "source_id": { "type": "string" },
          "target_id": { "type": "string" },
        },
        "required": ["description", "source_id", "target_id"],
      },
    },
  },
  "required": ["nodes", "edges"],
}

function validateJSON(json: string) {
  JSON.parse(json);
}

async function generateMindmap(topics: string[], mapSize: number = 8) {
  const openai = ml.getOpenAI();
  const topicsStr = topics.join(', ');
  const mapSizeClamped = Math.max(2, Math.min(mapSize, 30));
  const response = await openai.chat.completions.create({
    model: model,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that builds complex mind maps that are around ${mapSizeClamped} nodes in size. Connect all related nodes with edges. Only use the functions you have been provided with.`,
      },
      {
        role: "user",
        content: `Make a complex mind map using the following list of thoughts: ${topicsStr}.\nAdd interesting related thoughts as well`,
      },
    ],
    functions: [{ name: "make_mind_map", parameters: mindmapSchema }],
    function_call: { name: "make_mind_map" },
  });
  const map = response.choices[0].message.function_call?.arguments;
  validateJSON(map as string);
  return map;
}

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export default { getOpenAI, generateMindmap };
