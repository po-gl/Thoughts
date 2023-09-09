import { useCallback } from "react";
import { getBezierPath, getStraightPath, useStore } from "reactflow";
import { getEdgeParams } from "./util";

const EDGE_TYPE: 'bezier' | 'straight' = 'straight';

type Props = {
  id: string,
  source: string,
  target: string
};
function FloatingEdge({ id, source, target }: Props) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode, 20);

  let edgePath;
  switch (EDGE_TYPE) {
    case 'bezier':
      [edgePath] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        targetX: tx,
        targetY: ty,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
      });
      break;
    default:
      [edgePath] = getStraightPath({
        sourceX: sx,
        sourceY: sy,
        targetX: tx,
        targetY: ty,
      });
  }

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
    />
  );
}

export default FloatingEdge;