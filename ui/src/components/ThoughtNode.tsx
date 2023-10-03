import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Handle, Node, Position, useReactFlow } from 'reactflow';
import './styles/ThoughtNode.css';
import stars from '../assets/stars.svg';
import HistoryContext from '../context/HistoryContext.ts';
import SelectedNodeContext from '../context/SelectedNodeContext.ts';

export type WidgetType = 'thought';

export type ThoughtData = {
  text: string
  isGenerated?: boolean
};

type Props = {
  id: string,
  data: ThoughtData,
  isConnectable: boolean,
};
function ThoughtNode({ id, data, isConnectable }: Props) {
  const { getNode, getNodes, getEdges } = useReactFlow();
  const { updateHistory } = useContext(HistoryContext);
  const { setSelectedNodeId } = useContext(SelectedNodeContext);

  const [focused, setFocused] = useState(false);

  const [debounceDelayId, setDebounceDelayId] = useState<number>();
  const DEBOUNCE_DELAY_MS = 3000;

  const growTextArea = useRef<HTMLTextAreaElement | null>(null);

  const handleClick = useCallback(() => {
    setFocused(true);
    growTextArea.current?.focus();
    setSelectedNodeId(id);
  }, [id, setSelectedNodeId]);

  const onChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // debounce for a second then update database
    clearTimeout(debounceDelayId);
    const cancelable = window.setTimeout(() => {
      const node = getNode(id);
      if (node !== undefined) {
        node.data = { ...node.data, text: event.target.value };
      }
      updateHistory({ nodes: getNodes() as Node<ThoughtData, WidgetType>[], edges: getEdges() });
    }, DEBOUNCE_DELAY_MS);

    setDebounceDelayId(cancelable);
  }, [debounceDelayId, getEdges, getNode, getNodes, id, updateHistory]);


  // Used to auto resize textarea
  const grow = useCallback(() => {
    if (growTextArea.current?.parentNode instanceof HTMLElement) {
      growTextArea.current.parentNode.dataset.replicatedValue = growTextArea.current.value;
    }
  }, [growTextArea]);

  useEffect(() => {
    grow();
  }, [data, grow]);

  return (
    <div className={'thought-node-shadow'}>
      <div
        className="thought-node"
        onMouseDownCapture={handleClick}
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

            className={focused ? 'nodrag' : ''}
            style={{ cursor: focused ? 'default' : 'pointer' }}
            onBlur={() => setFocused(false)}
          />
        </div>
        <div className="is-generated">
          {data.isGenerated && (
            <img src={stars} />
          )}
        </div>
        <Handle type="source" position={Position.Bottom} id="a" isConnectable={isConnectable} />
      </div>
    </div>
  );
}

export default ThoughtNode;
