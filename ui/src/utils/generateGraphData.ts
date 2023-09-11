import { Node, Edge } from "reactflow";
import { ThoughtData, WidgetType } from "../components/ThoughtNode.tsx";

export default function generateGraphData() {
  const nodes: Node<ThoughtData, WidgetType>[] = [];
  const edges: Edge[] = [];
  const thoughts = ['Thoughts of animals', 'Plants', 'Programming', 'Thieving', 'Reading', 'Mysteries of the Universe', 'Rare Hmm'];
  for (let i = 0; i < 8; i++) {
    const rand = Math.random();
    nodes.push({
      id: `${i}`,
      type: 'thought',
      // position: { x: 300, y: 100 * i + 100 },
      position: { x: 300 * Math.cos(rand * 100), y: 300 * Math.sin(rand * 100) },
      data: {
        text: `${thoughts[Math.floor(rand * thoughts.length)]} ${i}`,
      }
    });
  }
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      if (i === j) continue;
      if (Math.random() > 0.6) continue;
      edges.push({
        id: `${i}-${j}`,
        type: 'floating',
        source: `${i}`,
        target: `${j}`,
      });
    }
  }
  return [nodes, edges] as const;
}
