import { useCallback, useContext } from "react";
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, getStraightPath, useStore } from "reactflow";
import getEdgeParams from "../utils/getEdgeParams";
import SelectedNodeContext from "../context/SelectedNodeContext";
import './styles/FloatingEdge.css';

const EDGE_TYPE: 'bezier' | 'straight' = 'straight';

function FloatingEdge({ id, source, target, data }: EdgeProps) {
  const sourceNode = useStore(useCallback((store) => store.nodeInternals.get(source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodeInternals.get(target), [target]));

  const { selectedNodeId } = useContext(SelectedNodeContext);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode, 20);

  let edgePath, labelX, labelY;
  switch (EDGE_TYPE) {
    case 'bezier':
      [edgePath, labelX, labelY] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        targetX: tx,
        targetY: ty,
        sourcePosition: sourcePos,
        targetPosition: targetPos,
      });
      break;
    default:
      [edgePath, labelX, labelY] = getStraightPath({
        sourceX: sx,
        sourceY: sy,
        targetX: tx,
        targetY: ty,
      });
  }

  const adjacentToSelectedNode = source === selectedNodeId || target === selectedNodeId;

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div className="edge-label" style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          opacity: adjacentToSelectedNode ? 1 : 0.2,
        }}>
          {data.justification}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default FloatingEdge;