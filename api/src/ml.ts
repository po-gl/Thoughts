/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv';
import OpenAI from 'openai';

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


async function generateMindmap(topics: string[]) {
  const openai = getOpenAI();
  const topicsStr = topics.join(', ');
  const mapSize = 14;
  const response = await openai.chat.completions.create({
    model: model,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that builds complex mind maps that are around ${mapSize} nodes in size. Connect all related nodes with edges. Only use the functions you have been provided with.`,
      },
      {
        role: "user",
        content: `Make a complex mind map using the following list of thoughts: ${topicsStr}.\nAdd interesting related thoughts as well`,
      },
    ],
    functions: [{ name: "make_mind_map", parameters: mindmapSchema }],
    function_call: { name: "make_mind_map" },
  });
  return response;
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
