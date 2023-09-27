import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { ReactFlowJsonObject, useReactFlow } from "reactflow";
import { MindMap } from "../components/MindMapList";
import { apiFetch } from "../utils/api";

function useMapsRoutes() {
  const reactFlowInstance = useReactFlow();
  const [shouldFitView, setShouldFitView] = useState(false);
  const [searchParams,] = useSearchParams();

  useEffect(() => {
    const mapId = searchParams.get('map');
    let mindMap: MindMap | undefined;
    const fetchMap = async () => {
      const response = await apiFetch(`/maps/${mapId}`, 'GET');
      if (!ignore) {
        const body = await response.text();
        const result = JSON.parse(body);
        if (result.error === undefined) {
          mindMap = result;
        }
      }
    }
    fetchMap().then(() => {
      if (!ignore) {
        if (mindMap !== undefined) {
          const flow: ReactFlowJsonObject = JSON.parse(mindMap.graph);
          reactFlowInstance.setNodes(flow.nodes || []);
          reactFlowInstance.setEdges(flow.edges || []);
          setShouldFitView(true);
        } else if (mapId) {
          toast.error("Map not found.");
        }
      }
    });

    let ignore = false;
    return () => {
      ignore = true;
    }
  }, [searchParams, reactFlowInstance])

  useEffect(() => {
    if (shouldFitView) {
      reactFlowInstance.fitView({ padding: 0.1, duration: 500 });
    }
    setShouldFitView(false);
  }, [reactFlowInstance, shouldFitView]);
}

export default useMapsRoutes;