import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { Edge, Node, ReactFlowJsonObject, useReactFlow } from 'reactflow';
import { MindMap } from '../components/MindMapList';
import { ThoughtData, WidgetType } from '../components/ThoughtNode';
import { apiFetch } from '../utils/api.ts';
import { HistoryState } from './useHistory';

type Props = {
  resetHistory: ({ nodes, edges }: HistoryState) => void
};
function useMapsRoutes({ resetHistory }: Props) {
  const reactFlowInstance = useReactFlow();
  const [shouldFitView, setShouldFitView] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const mapId = searchParams.get('map');
    let mindMap: MindMap | undefined;

    let ignore = false;
    const fetchMap = async () => {
      const response = await apiFetch(`/maps/${mapId}`, 'GET');
      if (!ignore) {
        const body = await response.text();
        const result = JSON.parse(body);
        if (result.error === undefined) {
          mindMap = result;
        }
      }
    };

    fetchMap().then(() => {
      if (!ignore) {
        if (mindMap !== undefined) {
          const flow: ReactFlowJsonObject = JSON.parse(mindMap.graph);
          const nodes = flow.nodes || [];
          const edges = flow.edges || [];
          reactFlowInstance.setNodes(nodes);
          reactFlowInstance.setEdges(edges);
          setShouldFitView(true);
          resetHistory({ nodes: nodes as Node<ThoughtData, WidgetType>[], edges: edges as Edge[] });
        } else if (mapId) {
          toast.error('Map not found.');
        }
      }
    });

    return () => {
      ignore = true;
    };
  }, [searchParams, reactFlowInstance, resetHistory]);

  useEffect(() => {
    if (shouldFitView) {
      reactFlowInstance.fitView({ padding: 0.1, duration: 500 });
    }
    setShouldFitView(false);
  }, [reactFlowInstance, shouldFitView]);
}

export default useMapsRoutes;
