import { Node, Edge } from "reactflow";
import { ThoughtData, WidgetType } from "../components/ThoughtNode.tsx";


type SimplifiedGraph = {
  nodes: { id: string, thought: string }[]
  edges: { justification: string, source_id: string, target_id: string }[]
}

export function convertSimplifiedGraph(graph: SimplifiedGraph) {
  const nodes: Node<ThoughtData, WidgetType>[] = [];
  const edges: Edge[] = [];
  const spread = 70;

  for (const { id, thought } of graph.nodes) {
    nodes.push({
      id,
      type: 'thought',
      position: { x: Math.random() * spread, y: Math.random() * spread },
      data: {
        text: thought,
      }
    });
  }

  for (const { justification, source_id, target_id } of graph.edges) {
    edges.push({
      id: `${source_id}-${target_id}`,
      type: 'floating',
      source: source_id,
      target: target_id,
      data: {
        justification,
      },
    });
  }
  return { nodes, edges };
}


export function stringsToNodes(strings: string[]) {
  const nodes: Node<ThoughtData, WidgetType>[] = [];
  const spread = 70;
  for (let i = 0; i < strings.length; i++) {
    nodes.push({
      id: `${i + 1}`,
      type: 'thought',
      // position: { x: 300 * Math.cos(i * 100), y: 300 * Math.sin(i * 100) },
      position: { x: Math.random() * spread, y: Math.random() * spread },
      data: {
        text: strings[i],
      }
    });
  }
  return nodes;
}
