import { ObjectId } from "mongodb";
import { ReactFlowJsonObject, useReactFlow } from "reactflow";
import { useEffect, useState } from "react";
import MindMapMenuButton from "./MindMapMenuButton";

export type MindMap = {
  _id: ObjectId;
  user: string;
  created: Date;
  modified: Date;
  deleted?: Date;
  title: string;
  description: string;
  graph: string;
}

type Props = {
  savedMaps: MindMap[]
}
function MindMapList({ savedMaps }: Props) {
  const reactFlowInstance = useReactFlow();
  const [shouldFitView, setShouldFitView] = useState(false);

  useEffect(() => {
    if (shouldFitView) {
      reactFlowInstance.fitView({ padding: 0.1, duration: 500 });
    }
    setShouldFitView(false);
  }, [reactFlowInstance, shouldFitView]);

  const mapList = savedMaps.map((mindMap) => (
    <MindMapMenuButton
      key={mindMap._id.toString()}
      mindMap={mindMap}
      onPress={async () => {
        const flow: ReactFlowJsonObject = JSON.parse(mindMap.graph);
        reactFlowInstance.setNodes(flow.nodes || []);
        reactFlowInstance.setEdges(flow.edges || []);
        setShouldFitView(true);
      }}
    />
  ))

  return (
    <>
      {mapList}
    </>
  );
}

export default MindMapList