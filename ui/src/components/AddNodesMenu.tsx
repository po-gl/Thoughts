import { faFeatherPointed } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useContext, useState } from 'react';
import { Edge, Node, Panel, useReactFlow } from 'reactflow';
import HistoryContext from '../context/HistoryContext.ts';
import ProgressContext from '../context/ProgressContext.ts';
import fetchGeneratedGraph from '../utils/api.ts';
import { stringsToNodes } from '../utils/conversions.ts';
import DropdownMenu from './DropdownMenu.tsx';
import { ThoughtData, WidgetType } from './ThoughtNode.tsx';
import stars from '../assets/stars.svg';
import './styles/AddNotesMenu.css';


type AddNodesMenuProps = {
  setShouldUpdateLayout: React.Dispatch<React.SetStateAction<boolean>>,
}
function AddNodesMenu({ setShouldUpdateLayout }: AddNodesMenuProps) {
  const { setNodes, setEdges } = useReactFlow();
  const { updateHistory } = useContext(HistoryContext);
  const { setInProgress } = useContext(ProgressContext);
  const [showing, setIsShowing] = useState(false);
  const [generateWithGPT, setGenerateWithGPT] = useState(true);
  const [mapSize, setMapSize] = useState(6);
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

  const sanitizedMapSize = useCallback(() => {
    return Math.max(Math.min(mapSize, 30), 5);
  }, [mapSize]);

  const addNodes = useCallback(async () => {
    const filteredNodesToAdd = nodesToAdd.filter(str => str !== "");
    if (filteredNodesToAdd.length === 0) return;
    setIsShowing(false);

    setNodes([]);
    setEdges([]);

    let newNodes: Node<ThoughtData, WidgetType>[];
    let newEdges: Edge[];
    if (generateWithGPT) {
      setInProgress(true);
      const size = sanitizedMapSize();
      ({ nodes: newNodes, edges: newEdges } = await fetchGeneratedGraph(filteredNodesToAdd, size));
    } else {
      newNodes = stringsToNodes(filteredNodesToAdd);
      newEdges = [];
    }
    const setFlow = async () => {
      setTimeout(() => {
        setNodes([...newNodes] || []);
        setEdges([...newEdges] || []);
      }, 0);
    };
    await setFlow();

    setInProgress(false);
    setShouldUpdateLayout(true);
    updateHistory({ nodes: newNodes, edges: newEdges });
  }, [nodesToAdd, setShouldUpdateLayout, updateHistory, setInProgress, generateWithGPT, sanitizedMapSize, setNodes, setEdges]);

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
              <label htmlFor="with-gpt">Generate with GPT</label>
              <img src={stars} />
            </div>
          </span>
          <span>
            <div className="slider-and-label">
              <input type="number" id="map-size" min="5" max="30" value={mapSize}
                onChange={e => setMapSize(parseInt(e.target.value))}
              />
              <label htmlFor="map-size">Map size</label>
            </div>
          </span>
          <span className='add-nodes-button-span'>
            <button onClick={() => setNodesToAdd([""])}>Clear</button>
            <button onClick={addNodes} className={generateWithGPT ? 'with-gradient' : ''}>Add thoughts</button>
          </span>
        </Panel>
      </DropdownMenu>
    </div>
  );
}

export default AddNodesMenu;
