import { useState, useCallback } from 'react';
import { Edge, Node } from 'reactflow';
import { ThoughtData, WidgetType } from './ThoughtNode.tsx';

export type HistoryState = {
  nodes: Node<ThoughtData, WidgetType>[]
  edges: Edge[]
}

type useHistoryProps = {
  initialNodes: Node<ThoughtData, WidgetType>[]
  initialEdges: Edge[]
  setNodes: React.Dispatch<React.SetStateAction<Node<ThoughtData, WidgetType>[]>>
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
}

function useHistory({ initialNodes, initialEdges, setNodes, setEdges }: useHistoryProps) {
  const [currHistoryIndex, setHistoryIndex] = useState(0);
  const [history, setHistory] = useState([{ nodes: initialNodes, edges: initialEdges }] as HistoryState[]);

  const undo = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setTimeout(() => {
      setNodes(() => {
        const i = currHistoryIndex;
        return history[i > 0 ? i - 1 : i].nodes;
      });
      setEdges(() => {
        const i = currHistoryIndex;
        return history[i > 0 ? i - 1 : i].edges;
      });
    }, 0);
    setHistoryIndex(prev => prev > 0 ? prev - 1 : prev);
  }, [history, currHistoryIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setTimeout(() => {
      setNodes(() => {
        const i = currHistoryIndex;
        return history[i < history.length - 1 ? i + 1 : i].nodes;
      });
      setEdges(() => {
        const i = currHistoryIndex;
        return history[i < history.length - 1 ? i + 1 : i].edges;
      });
    }, 0);
    setHistoryIndex(prev => prev < history.length - 1 ? prev + 1 : prev);
  }, [history, currHistoryIndex, setNodes, setEdges]);


  const updateHistory = useCallback(({ nodes = [], edges = [] }: HistoryState) => {
    setHistory(prev => {
      const newHistoryState: HistoryState = { nodes, edges };
      const newHistory = [...prev.slice(0, currHistoryIndex + 1), newHistoryState];
      console.log(`Updating history, newHistoryState.nodes.length: ${newHistoryState.nodes.length}`)
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [currHistoryIndex]);

  const canUndo = currHistoryIndex > 0;

  const canRedo = currHistoryIndex < history.length - 1;

  return [undo, redo, canUndo, canRedo, updateHistory] as const;
}

export default useHistory;