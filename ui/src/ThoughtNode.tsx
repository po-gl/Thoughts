import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Handle, Node, Position, useReactFlow } from 'reactflow';
import './ThoughtNode.css';
import HistoryContext from "./HistoryContext";

export type WidgetType = 'thought';

export type ThoughtData = {
  text: string
};

type Props = {
  id: string,
  data: ThoughtData,
  isConnectable: boolean,
};
function ThoughtNode({ id, data, isConnectable }: Props) {
  const { getNode, getNodes, getEdges } = useReactFlow();
  const { updateHistory } = useContext(HistoryContext);

  const [debounceDelayId, setDebounceDelayId] = useState<number>();
  const debounce_delay_ms = 3000;

  const onChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // debounce for a second then update database
    clearTimeout(debounceDelayId);
    const cancelable = setTimeout(() => {
      const node = getNode(id);
      if (node !== undefined) {
        node.data = { ...node.data, text: event.target.value };
      }
      updateHistory({ nodes: getNodes() as Node<ThoughtData, WidgetType>[], edges: getEdges() });
    }, debounce_delay_ms);
    console.log(`debounceDelayId: ${cancelable}`);

    setDebounceDelayId(cancelable);
  }, [debounceDelayId, getEdges, getNode, getNodes, id, updateHistory]);

  const growTextArea = useRef<HTMLTextAreaElement | null>(null);

  const [focused, setFocused] = useState(false);

  // Used to auto resize textarea
  const grow = useCallback(() => {
    if (growTextArea.current?.parentNode instanceof HTMLElement) {
      growTextArea.current.parentNode.dataset.replicatedValue = growTextArea.current.value;
    }
  }, [growTextArea]);

  useEffect(() => {
    grow()
  }, [data, grow]);

  return (
    <div className="thought-node-shadow">
      <div
        className="thought-node"
        onClick={() => {
          setFocused(true);
          growTextArea.current?.focus();
        }}
      >
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
        <div className="grow-wrap">
          <textarea
            ref={growTextArea}
            id="text"
            name="text"
            placeholder="Thought..."
            defaultValue={data.text}
            rows={1}
            onInput={grow}
            onChange={onChange}

            className={focused ? "nodrag" : ""}
            style={{ cursor: focused ? "default" : "pointer" }}
            onBlur={() => setFocused(false)}
          />
        </div>
        <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
      </div>
    </div>
  );
}

export default ThoughtNode;