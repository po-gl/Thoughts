/* eslint-disable import/no-extraneous-dependencies */
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

let openai: OpenAI;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export default getOpenAI;
