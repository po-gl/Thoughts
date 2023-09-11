import { Panel, useReactFlow } from 'reactflow';
import './styles/ZoomControls.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const animation_duration_ms = 200;
const view_fit_padding = 0.1;

function ZoomControls() {
  const reactFlowInstance = useReactFlow();

  return (
    <Panel position="bottom-left" className="sub-controls-panel">
      <button id="first" onClick={() => reactFlowInstance.zoomOut({ duration: animation_duration_ms })} >
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <button id="middle" onClick={() => reactFlowInstance.fitView({ padding: view_fit_padding, duration: animation_duration_ms })} >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
      <button id="last" onClick={() => reactFlowInstance.zoomIn({ duration: animation_duration_ms })} >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </Panel>
  );
}

export default ZoomControls;