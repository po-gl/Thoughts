import { Node, NodeChange, applyNodeChanges, Position, XYPosition, Edge } from "reactflow";
import { ThoughtData, WidgetType } from "./ThoughtNode.tsx";

export function applyNodeChangesWithTypes(changes: NodeChange[], nodes: Node<ThoughtData, WidgetType>[]) {
  return applyNodeChanges(changes, nodes) as unknown as Node<ThoughtData, WidgetType>[];
}

export function generateGraphData() {
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

export function randomEdges(nodes: Node<ThoughtData, WidgetType>[]) {
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

function getNodeIntersection(intersectionNode: Node, targetNode: Node, widthOffset: number): XYPosition {
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;
  const targetPosition = targetNode.positionAbsolute;
  if (intersectionNodeWidth == null || intersectionNodeHeight == null || intersectionNodePosition == null || targetPosition == null) {
    return { x: 0, y: 0 };
  }

  const w = intersectionNodeWidth / 2 - widthOffset;
  const h = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w + widthOffset;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + w + widthOffset;
  const y1 = targetPosition.y + h;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node: Node, intersectionPoint: XYPosition, widthOffset: number): Position {
  const n = { ...node.positionAbsolute, ...node };
  if (n.x == null || n.y == null || n.width == null || n.height == null) {
    return Position.Top;
  }

  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1 + (widthOffset * 2)) {
    return Position.Left;
  }
  if (px >= nx + n.width - (widthOffset * 2) - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: Node, target: Node, widthOffset: number = 0): { sx: number, sy: number, tx: number, ty: number, sourcePos: Position, targetPos: Position } {
  const sourceIntersectionPoint = getNodeIntersection(source, target, widthOffset);
  const targetIntersectionPoint = getNodeIntersection(target, source, widthOffset);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint, widthOffset);
  const targetPos = getEdgePosition(target, targetIntersectionPoint, widthOffset);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}
