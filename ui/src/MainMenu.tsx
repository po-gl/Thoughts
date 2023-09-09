import { useState } from "react";
import { Panel } from "reactflow";
import { faBarsStaggered, faCircleNodes } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './MainMenu.css';
import DropdownMenu from "./DropdownMenu.tsx";
import MenuButton from "./MenuButton.tsx";

function MainMenuButton({ onPress }: { onPress: () => void }) {
  return (
    <Panel position="top-left" className="main-menu-button-panel">
      <button onClick={() => onPress()}>
        <FontAwesomeIcon icon={faBarsStaggered} />
      </button>
    </Panel>
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
          <MenuButton text="New map" icon={<FontAwesomeIcon icon={faCircleNodes} />} />
          <MenuButton text="Delete map" icon={<FontAwesomeIcon icon={faTrashCan} />} />
          <div className="divider" />
          <MenuButton text="Help" shortcut="?" icon={<FontAwesomeIcon icon={faCircleQuestion} />} />
          <MenuButton text="Github" icon={<FontAwesomeIcon icon={faGithub} />} />
        </Panel>
      </DropdownMenu>
    </>
  );
}

export default MainMenu;