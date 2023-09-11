import { convertSimplifiedGraph } from "./conversions";

const api_endpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api';

async function apiFetch(endpoint: string, method: string, data?: object) {
  const response = await fetch(`${api_endpoint}${endpoint}`, {
    method: method,
    body: JSON.stringify(data),
    headers: data ? { 'Content-Type': 'application/json', } : {},
  });
  return response;
}

async function fetchGeneratedGraph(thoughts: string[]) {
  try {
    const response = await apiFetch('/generate-mindmap', 'POST', { thoughts });
    const body = await response.text();
    const result = JSON.parse(body);

    if (result.error) {
      throw new Error(result.error);
    }
    return convertSimplifiedGraph(result);

  } catch (error) {
    console.log(error);
  }
  return { nodes: [], edges: [] };
}

export default fetchGeneratedGraph;
