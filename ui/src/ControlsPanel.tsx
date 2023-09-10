import { IconDefinition, faArrowPointer, faHand, faLock, faRotateLeft, faRotateRight, faUnlock, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Panel } from 'reactflow';
import AddNodesMenu from './AddNodesMenu';
import './ControlsPanel.css';
import { ToolMode } from './App';


type ToolButtonProps = {
  id?: string
  toolMode: ToolMode
  icon: IconDefinition
  currentToolMode: ToolMode
  setToolMode: React.Dispatch<React.SetStateAction<ToolMode>>;
}
function ToolButton({ id = '', toolMode, icon, currentToolMode, setToolMode }: ToolButtonProps) {
  return (
    <button
      id={id}
      className={currentToolMode === toolMode ? 'activated' : ''}
      onClick={() => setToolMode(toolMode)}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
}

type LockButtonProps = {
  id: string;
  isLocked: boolean;
  toggleLock: () => void;
}
function LockButton({ id, isLocked, toggleLock }: LockButtonProps) {
  return (
    <button id={id} className={isLocked ? 'activated' : ''} onClick={toggleLock} >
      <FontAwesomeIcon icon={isLocked ? faLock : faUnlock} />
    </button>
  );
}

type ControlPanelProps = {
  toolMode: ToolMode,
  setToolMode: React.Dispatch<React.SetStateAction<ToolMode>>,
  isLocked: boolean,
  toggleLock: () => void,
  undo: () => void,
  redo: () => void,
  canUndo: boolean,
  canRedo: boolean,
  setShouldUpdateLayout: React.Dispatch<React.SetStateAction<boolean>>,
}
function ControlsPanel({ toolMode, setToolMode, isLocked, toggleLock, undo, redo, canUndo, canRedo, setShouldUpdateLayout }: ControlPanelProps) {
  return (
    <Panel position="top-center" className="controls-panel">

      <ToolButton id="first" toolMode={'panning'} icon={faHand} currentToolMode={toolMode} setToolMode={setToolMode} />
      <ToolButton toolMode={'selecting'} icon={faArrowPointer} currentToolMode={toolMode} setToolMode={setToolMode} />
      <AddNodesMenu setShouldUpdateLayout={setShouldUpdateLayout} />

      <span className="divider" />

      <button onClick={() => console.log('Clicked Assistant')}><FontAwesomeIcon icon={faWandMagicSparkles} /></button>

      <span className="divider" />

      <button onClick={undo} disabled={!canUndo}><FontAwesomeIcon icon={faRotateLeft} /></button>
      <button onClick={redo} disabled={!canRedo}><FontAwesomeIcon icon={faRotateRight} /></button>

      <span className="divider" />
      <LockButton id="last" isLocked={isLocked} toggleLock={toggleLock} />
    </Panel >
  );
}

export default ControlsPanel;