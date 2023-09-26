import { useCallback, useContext, useEffect, useState } from "react";
import { Panel, useReactFlow } from "reactflow";
import { faBarsStaggered, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './styles/MainMenu.css';
import DropdownMenu from "./DropdownMenu.tsx";
import MenuButton from "./MenuButton.tsx";
import HistoryContext from "../context/HistoryContext.ts";
import { apiFetch } from "../utils/api.ts";
import toast from "react-hot-toast";
import MindMapList, { MindMap } from "./MindMapList.tsx";

function MainMenuButton({ onPress }: { onPress: () => void }) {
  return (
    <Panel position="top-left" className="main-menu-button-panel">
      <button onClick={() => onPress()}>
        <FontAwesomeIcon icon={faBarsStaggered} />
      </button>
    </Panel>
  );
}

function SaveMapButton() {

  const reactFlowInstance = useReactFlow();

  const saveMap = useCallback(async () => {
    const mindmap = {
      user: 'tester',
      graph: JSON.stringify(reactFlowInstance.toObject())
    }
    const response = await apiFetch('/maps', 'POST', { mindmap });
    const body = await response.text();
    const result = JSON.parse(body);

    if (result.status === 'ok') {
      toast.success('Map saved.');
    } else {
      toast.error("There was an error saving the map.");
    }

  }, [reactFlowInstance]);

  return (
    <MenuButton text="Save map" onPress={saveMap} icon={<FontAwesomeIcon icon={faSave} />} />
  )
}

function ClearMapButton() {
  const { setNodes, setEdges } = useReactFlow();
  const { updateHistory } = useContext(HistoryContext);

  const clearMap = useCallback(() => {
    setNodes([]);
    setEdges([]);
    updateHistory({ nodes: [], edges: [] });
  }, [setEdges, setNodes, updateHistory]);

  return (
    <MenuButton text="Clear map" onPress={clearMap} icon={<FontAwesomeIcon icon={faXmark} />} />
  );
}

function MainMenu() {
  const [showing, setIsShowing] = useState(false);
  const [savedMaps, setSavedMaps] = useState<MindMap[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiFetch('/maps', 'GET');
      if (!ignore) {
        const body = await response.text();
        const result = JSON.parse(body);
        console.log(result.length);
        if (result.error === undefined) {
          setSavedMaps(result);
        }
      }
    }

    let ignore = false;
    fetchData();
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <MainMenuButton onPress={() => setIsShowing(prev => !prev)} />

      <DropdownMenu showing={showing}>
        <Panel
          position="top-left"
          className="main-menu-panel"
          style={{ top: '2.8em' }}
        >
          <div className="mindmap-list">
            <MindMapList savedMaps={savedMaps} />
          </div>
          <div className="list-divider" />
          <SaveMapButton />
          <ClearMapButton />
          <div className="divider" />
          {/* <MenuButton text="Help" shortcut="?" icon={<FontAwesomeIcon icon={faCircleQuestion} />} /> */}
          <MenuButton
            text="Github"
            link="https://github.com/po-gl/Thoughts"
            icon={<FontAwesomeIcon icon={faGithub} />}
          />
        </Panel>
      </DropdownMenu>
    </>
  );
}

export default MainMenu;