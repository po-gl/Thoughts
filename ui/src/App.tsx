import { useCallback, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import ReactFlow, { Background, Connection, Edge, EdgeChange, Node, NodeChange, ReactFlowJsonObject, ReactFlowProvider, SelectionMode, addEdge, applyEdgeChanges, useReactFlow, } from 'reactflow';
import 'reactflow/dist/style.css';
import ControlsPanel from './components/ControlsPanel.tsx';
import FloatingEdge from './components/FloatingEdge.tsx';
import MainMenu from './components/MainMenu.tsx';
import { MindMap } from './components/MindMapList.tsx';
import ProgressIndicator from './components/ProgressIndicator.tsx';
import ThoughtNode, { ThoughtData, WidgetType } from './components/ThoughtNode.tsx';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import ZoomControls from './components/ZoomControls.tsx';
import HistoryContext from './context/HistoryContext.ts';
import ProgressContext from './context/ProgressContext.ts';
import SelectedNodeContext from './context/SelectedNodeContext.ts';
import useHistory from './hooks/useHistory.tsx';
import useLayoutElements from './hooks/useLayoutElements.tsx';
import { apiFetch } from './utils/api.ts';
import applyNodeChangesWithTypes from './utils/applyNodeChangesWithTypes.ts';


const initialNodes: Node<ThoughtData, WidgetType>[] = [];
const initialEdges: Edge[] = [];

const nodeTypes = { thought: ThoughtNode };
const edgeTypes = { floating: FloatingEdge };

export type ToolMode = 'panning' | 'selecting';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const reactFlowInstance = useReactFlow();
  const [nodes, setNodes] = useState<Node<ThoughtData, WidgetType>[]>(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [undo, redo, canUndo, canRedo, updateHistory] = useHistory({ initialNodes, initialEdges, setNodes, setEdges });

  const [shouldUpdateLayout, setShouldUpdateLayout] = useState(false);
  useLayoutElements({ shouldUpdateLayout, setShouldUpdateLayout, updateMemo: undo });

  const [toolMode, setToolMode] = useState<ToolMode>('panning');

  const [isLocked, setIsLocked] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);

  const [inProgress, setInProgress] = useState(false);
  const [estimatedTimeS, setEstimatedTimeS] = useState(0);

  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>(undefined);

  const [shouldFitView, setShouldFitView] = useState(false);
  const [searchParams,] = useSearchParams();

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setShowWelcome(false);
      setNodes((nds) => applyNodeChangesWithTypes(changes, nds))
    }
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

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <HistoryContext.Provider value={{ undo, redo, canUndo, canRedo, updateHistory }}>
        <ProgressContext.Provider value={{ inProgress, setInProgress, estimatedTimeS, setEstimatedTimeS }}>
          <SelectedNodeContext.Provider value={{ selectedNodeId, setSelectedNodeId }}>
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
              onMoveStart={() => setSelectedNodeId(undefined)}
              selectionMode={SelectionMode.Partial}
              panOnDrag={toolMode === 'panning' && !showWelcome}
              selectionOnDrag={toolMode === 'selecting'}
              defaultViewport={{ x: 0, y: 0, zoom: 1.8 }}
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
              {showWelcome &&
                <WelcomeScreen />
              }
            </ReactFlow>
          </SelectedNodeContext.Provider>
        </ProgressContext.Provider>
      </HistoryContext.Provider>
      <Toaster
        position='bottom-center'
        toastOptions={{
          className: 'toast',
          duration: 5000,
          error: {
            className: 'toast toast-error',
            duration: 5000,
            icon: '❌'
          },
          success: {
            className: 'toast toast-success',
          }
        }}
      />
    </div>
  );
}

export default function WrappedApp() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  )
}
