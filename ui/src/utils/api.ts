import toast from 'react-hot-toast';
import { convertSimplifiedGraph } from './conversions.ts';
import { JSONParseError, ResponseError } from './errors.ts';

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api';

async function apiFetch(endpoint: string, method: string, data?: object) {
  const response = await fetch(`${API_ENDPOINT}${endpoint}`, {
    method: method,
    body: JSON.stringify(data),
    headers: data ? { 'Content-Type': 'application/json' } : {},
  });
  return response;
}

async function fetchGeneratedGraph(thoughts: string[], mapSize: number) {
  try {
    const response = await apiFetch('/generate-mindmap', 'POST', { thoughts, mapSize });
    if (response.status !== 200) throw new ResponseError(response.statusText);
    const body = await response.text();
    const result = JSON.parse(body);

    if (result.error) throw new JSONParseError(result.error);
    const { nodes, edges } = convertSimplifiedGraph(result);

    const updatedNodes = nodes.map(node => {
      if (!thoughts.includes(node.data.text)) {
        node.data = { ...node.data, isGenerated: true };
      }
      return node;
    });

    return { nodes: updatedNodes, edges };

  } catch (error) {
    if (error instanceof ResponseError) {
      toast.error('There was a problem with the server.');
    } else if (error instanceof JSONParseError) {
      toast.error('There was a problem generating the map.');
    } else {
      toast.error('Something went wrong');
    }
    console.log(error);
  }
  return { nodes: [], edges: [] };
}

export { fetchGeneratedGraph, apiFetch };
