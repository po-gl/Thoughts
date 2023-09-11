import { Node, Edge } from "reactflow";
import { ThoughtData, WidgetType } from "../components/ThoughtNode.tsx";

export default function generateRandomEdges(nodes: Node<ThoughtData, WidgetType>[]) {
  const edges: Edge[] = [];
  for (let i = 1; i < nodes.length + 1; i++) {
    for (let j = i + 1; j < nodes.length + 1; j++) {
      if (Math.random() > 0.6) continue;
      edges.push({
        id: `${i}-${j}`,
        type: 'floating',
        source: `${i}`,
        target: `${j}`,
      });
    }
  }
  return edges;
}
