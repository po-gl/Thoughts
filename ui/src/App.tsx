import { useCallback, useState } from 'react';
import ReactFlow, { Background, Connection, Edge, EdgeChange, Node, NodeChange, ReactFlowProvider, SelectionMode, addEdge, applyEdgeChanges, } from 'reactflow';
import 'reactflow/dist/style.css';

import ControlsPanel from './components/ControlsPanel.tsx';
import FloatingEdge from './components/FloatingEdge.tsx';
import MainMenu from './components/MainMenu.tsx';
import ThoughtNode, { ThoughtData, WidgetType } from './components/ThoughtNode.tsx';
import ZoomControls from './components/ZoomControls.tsx';
import HistoryContext from './context/HistoryContext.ts';
import useHistory from './hooks/useHistory.tsx';
import useLayoutElements from './hooks/useLayoutElements.tsx';
import applyNodeChangesWithTypes from './utils/applyNodeChangesWithTypes.ts';
import ProgressContext from './context/ProgressContext.ts';
import ProgressIndicator from './components/ProgressIndicator.tsx';


const initialNodes: Node<ThoughtData, WidgetType>[] = [
  {
    id: '1',
    type: 'thought',
    position: { x: -200, y: -200 },
    data: { text: "I am a thought.", isGenerated: true },
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

export type ToolMode = 'panning' | 'selecting';

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [undo, redo, canUndo, canRedo, updateHistory] = useHistory({ initialNodes, initialEdges, setNodes, setEdges });

  const [shouldUpdateLayout, setShouldUpdateLayout] = useState(false);
  useLayoutElements({ shouldUpdateLayout, setShouldUpdateLayout, updateMemo: undo });

  const [toolMode, setToolMode] = useState<ToolMode>('panning');

  const [isLocked, setIsLocked] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);

  const [inProgress, setInProgress] = useState(false);
  const [estimatedTimeS, setEstimatedTimeS] = useState(0);

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
        <ProgressContext.Provider value={{ inProgress, setInProgress, estimatedTimeS, setEstimatedTimeS }}>
          <ReactFlow
            fitView={true}
            fitViewOptions={{ padding: 0.3 }}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            proOptions={{ hideAttribution: true }}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodesDraggable={isDraggable}
            onNodeDragStop={() => updateHistory({ nodes, edges })}
            selectionMode={SelectionMode.Partial}
            panOnDrag={toolMode === 'panning'}
            selectionOnDrag={toolMode === 'selecting'}
          >
            <Background />
            <MainMenu />
            <ControlsPanel
              toolMode={toolMode}
              setToolMode={setToolMode}
              isLocked={isLocked}
              toggleLock={toggleLock}
              undo={undo}
              redo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              setShouldUpdateLayout={setShouldUpdateLayout}
            />
            <ProgressIndicator />
            <ZoomControls />
          </ReactFlow>
        </ProgressContext.Provider>
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
