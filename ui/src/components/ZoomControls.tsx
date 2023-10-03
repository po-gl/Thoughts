import { Panel, useReactFlow } from 'reactflow';
import './styles/ZoomControls.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompress, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const ANIMATION_DURATION_MS = 200;
const VIEW_FIT_PADDING = 0.1;

function ZoomControls() {
  const reactFlowInstance = useReactFlow();

  return (
    <Panel position="bottom-left" className="sub-controls-panel">
      <button id="first" onClick={() => reactFlowInstance.zoomOut({ duration: ANIMATION_DURATION_MS })} >
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <button id="middle" onClick={() => reactFlowInstance.fitView({ padding: VIEW_FIT_PADDING, duration: ANIMATION_DURATION_MS })} >
        <FontAwesomeIcon icon={faCompress} />
      </button>
      <button id="last" onClick={() => reactFlowInstance.zoomIn({ duration: ANIMATION_DURATION_MS })} >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </Panel>
  );
}

export default ZoomControls;
