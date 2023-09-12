import { useCallback, useContext, useState } from "react";
import { Panel, useReactFlow } from "reactflow";
import { faBarsStaggered, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './styles/MainMenu.css';
import DropdownMenu from "./DropdownMenu.tsx";
import MenuButton from "./MenuButton.tsx";
import HistoryContext from "../context/HistoryContext.ts";

function MainMenuButton({ onPress }: { onPress: () => void }) {
  return (
    <Panel position="top-left" className="main-menu-button-panel">
      <button onClick={() => onPress()}>
        <FontAwesomeIcon icon={faBarsStaggered} />
      </button>
    </Panel>
  );
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

  return (
    <>
      <MainMenuButton onPress={() => setIsShowing(prev => !prev)} />

      <DropdownMenu showing={showing}>
        <Panel
          position="top-left"
          className="main-menu-panel"
          style={{ top: '2.8em' }}
        >
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