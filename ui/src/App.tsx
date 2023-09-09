import { useState, useCallback } from 'react';
import ReactFlow, { Background, applyEdgeChanges, addEdge, EdgeChange, NodeChange, Connection, Edge, Node, ReactFlowProvider, } from 'reactflow';
import 'reactflow/dist/style.css';

import ThoughtNode, { ThoughtData, WidgetType } from './ThoughtNode.tsx';
import FloatingEdge from './FloatingEdge.tsx';
import { applyNodeChangesWithTypes } from './util.ts';
import ControlsPanel from './ControlsPanel.tsx';
import MainMenu from './MainMenu.tsx';
import ZoomControls from './ZoomControls.tsx';
import useHistory from './useHistory.tsx';
import useLayoutElements from './useLayoutElements.tsx';
import HistoryContext from './HistoryContext.ts';


const initialNodes: Node<ThoughtData, WidgetType>[] = [
  {
    id: '1',
    type: 'thought',
    position: { x: -200, y: -200 },
    data: { text: "I am a thought." },
  },
  {
    id: '2',
    type: 'thought',
    position: { x: 0, y: 200 },
    data: { text: "" },
  },
  {
    id: '3',
    type: 'thought',
    position: { x: 200, y: -140 },
    data: { text: "I am another" },
  }
];

const initialEdges: Edge[] = [
  {
    id: '1-2',
    type: 'floating',
    source: '1',
    target: '2'
  },
  {
    id: '1-3',
    type: 'floating',
    source: '1',
    target: '3'
  },
];

const nodeTypes = { thought: ThoughtNode };
const edgeTypes = { floating: FloatingEdge };


function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [undo, redo, canUndo, canRedo, updateHistory] = useHistory({ initialNodes, initialEdges, setNodes, setEdges });

  const [shouldUpdateLayout, setShouldUpdateLayout] = useState(false);
  useLayoutElements({ shouldUpdateLayout, setShouldUpdateLayout, updateMemo: undo });

  const [isLocked, setIsLocked] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);


  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChangesWithTypes(changes, nds))
    , []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds))
    , []
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: 'floating' }, eds))
    , []
  );

  const toggleLock = useCallback(() => {
    setIsDraggable(prev => !prev);
    setIsLocked(prev => !prev);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <HistoryContext.Provider value={{ undo, redo, canUndo, canRedo, updateHistory }}>
        <ReactFlow
          fitView={true}
          fitViewOptions={{ padding: 0.3 }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          proOptions={{ hideAttribution: true }}  // personal project
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodesDraggable={isDraggable}
          onNodeDragStop={() => updateHistory({ nodes, edges })}
        >
          <Background />
          <MainMenu />
          <ControlsPanel
            isLocked={isLocked}
            toggleLock={toggleLock}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            setShouldUpdateLayout={setShouldUpdateLayout}
          />
          <ZoomControls />
        </ReactFlow>
      </HistoryContext.Provider>
    </div>
  );
}

// export default App;
export default function WrappedApp() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  )
}
