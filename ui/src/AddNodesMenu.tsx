import { faFeatherPointed } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useContext, useState } from 'react';
import { Edge, Panel, useReactFlow } from 'reactflow';
import './AddNotesMenu.css';
import DropdownMenu from './DropdownMenu';
import { randomEdges, stringsToNodes } from './util';
import HistoryContext from './HistoryContext';

type AddNodesMenuProps = {
  setShouldUpdateLayout: React.Dispatch<React.SetStateAction<boolean>>,
}
function AddNodesMenu({ setShouldUpdateLayout }: AddNodesMenuProps) {
  const { setNodes, setEdges } = useReactFlow();
  const { updateHistory } = useContext(HistoryContext);
  const [showing, setIsShowing] = useState(false);
  const [generateWithGPT, setGenerateWithGPT] = useState(true);
  const [nodesToAdd, setNodesToAdd] = useState<string[]>(["Fruits", "Fries", "Lies", "And butterflies", ""]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const index = parseInt(e.target.getAttribute('id') ?? "-1");
    setNodesToAdd(prev => {
      return prev
        .map((str, i) => i === index ? e.target.value : str)
        .concat(index === nodesToAdd.length - 1 ? "" : []);
    });
  }, [nodesToAdd.length]);

  const addNodeItems = nodesToAdd.map((str, i) => (
    <li key={i}><span>
      <input
        type="text"
        onInput={handleInput}
        placeholder="thought..."
        value={str}
        id={`${i}`}
      />
    </span></li>
  ));

  const addNodes = useCallback(async () => {
    const filteredNodesToAdd = nodesToAdd.filter(str => str !== "");
    if (filteredNodesToAdd.length === 0) return;
    const newNodes = stringsToNodes(filteredNodesToAdd);
    const newEdges: Edge[] = randomEdges(newNodes);
    // const [newNodes, newEdges] = generateGraphData();
    const setFlow = async () => {
      setNodes([]);
      setEdges([]);
      setTimeout(() => {
        setNodes([...newNodes] || []);
        setEdges([...newEdges] || []);
      }, 0);
    };
    await setFlow();
    setShouldUpdateLayout(true);
    updateHistory({ nodes: newNodes, edges: newEdges });
    setIsShowing(false);
  }, [nodesToAdd, setNodes, setEdges, setShouldUpdateLayout, updateHistory]);

  return (
    <div className="add-nodes-menu">
      <button
        onClick={() => setIsShowing(prev => !prev)}
        className={showing ? "activated" : ""}
      >
        <FontAwesomeIcon icon={faFeatherPointed} />
      </button>
      <DropdownMenu showing={showing} >
        <Panel
          position="top-center"
          className="add-nodes-menu-panel"
          style={{ top: '2.1em', transform: 'translateX(-50%)' }}
        >
          <ul>
            {addNodeItems}
          </ul>
          <div className='divider' />
          <span>
            <div className="checkbox-and-label">
              <input type="checkbox" className="checkbox" id="with-gpt"
                onChange={e => setGenerateWithGPT(e.target.checked)}
                checked={generateWithGPT}
              />
              <label htmlFor="with-gpt">Generate with GPT ✨</label>
            </div>
          </span>
          <span className='add-nodes-button-span'>
            <button onClick={() => setNodesToAdd([""])}>Clear</button>
            <button onClick={addNodes}>Add thoughts</button>
          </span>
        </Panel>
      </DropdownMenu>
    </div>
  );
}

export default AddNodesMenu;
