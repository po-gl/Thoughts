import { Node, NodeChange, applyNodeChanges } from 'reactflow';
import { ThoughtData, WidgetType } from '../components/ThoughtNode.tsx';

export default function applyNodeChangesWithTypes(changes: NodeChange[], nodes: Node<ThoughtData, WidgetType>[]) {
  return applyNodeChanges(changes, nodes) as unknown as Node<ThoughtData, WidgetType>[];
}
