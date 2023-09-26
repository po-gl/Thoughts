import { ObjectId } from "mongodb";
import MenuButton from "./MenuButton";
import { ReactFlowJsonObject, useReactFlow } from "reactflow";
import { useEffect, useState } from "react";

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

function MindMapList({ savedMaps }: { savedMaps: MindMap[] }) {
  const reactFlowInstance = useReactFlow();
  const [shouldFitView, setShouldFitView] = useState(false);

  useEffect(() => {
    if (shouldFitView) {
      reactFlowInstance.fitView({ padding: 0.1, duration: 500 });
    }
    setShouldFitView(false);
  }, [reactFlowInstance, shouldFitView]);

  const mapList = savedMaps.map((mindMap) => (
    <MenuButton
      key={mindMap._id.toString()}
      text={mindMap.title}
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