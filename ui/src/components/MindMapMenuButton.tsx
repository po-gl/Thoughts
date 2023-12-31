import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { useReactFlow } from 'reactflow';
import { apiFetch } from '../utils/api.ts';
import { MindMap } from './MindMapList';
import Modal from './Modal';
import './styles/MenuButton.css';
import './styles/MindMapMenuButton.css';

type Props = {
  mindMap: MindMap;
  onPress: () => void;
  setShouldRefreshMaps: React.Dispatch<React.SetStateAction<boolean>>;
};
function MindMapMenuButton({ mindMap, onPress, setShouldRefreshMaps }: Props) {
  const reactFlowInstance = useReactFlow();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showInnerButtons, setShowInnerButtons] = useState(false);

  const [showRenameModal, setShowRenameModal] = useState(false);
  const renameInput = useRef<HTMLInputElement>(null);

  const onRename = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowRenameModal(true);
  }, []);

  const renameMindMap = useCallback(async (title: string) => {
    const id = mindMap._id.toString();
    const response = await apiFetch(`/maps/${id}`, 'PUT', { mindmap: { ...mindMap, title } });
    if (response.status === 200) {
      toast.success('Map renamed.');
      setShouldRefreshMaps(true);
    } else {
      toast.error('There was an error updating the map.');
    }
  }, [mindMap, setShouldRefreshMaps]);

  const onDelete = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const id = mindMap._id.toString();
    const response = await apiFetch(`/maps/${id}`, 'DELETE');
    if (response.status === 200) {
      toast.success('Map deleted.');
      reactFlowInstance.setNodes([]);
      reactFlowInstance.setEdges([]);
      setShouldRefreshMaps(true);
      setSearchParams({});
    } else {
      toast.error('There was an error deleting the map.');
    }
  }, [mindMap._id, reactFlowInstance, setShouldRefreshMaps, setSearchParams]);

  const isSelected = searchParams.get('map') === mindMap._id.toString();

  return (
    <>
      <button
        className={`menu-button mindmap-button ${isSelected ? 'selected' : ''}`}
        onClick={onPress}
        onMouseEnter={() => setShowInnerButtons(true)}
        onMouseLeave={() => setShowInnerButtons(false)}
      >
        <div className={`menu-text ${showInnerButtons ? 'hideOverflow' : ''}`} >
          {mindMap.title}
        </div>
        <div className={`inner-buttons ${showInnerButtons ? 'showing' : ''}`}>
          <button className="inner-button" onClick={onRename}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button className="inner-button" onClick={onDelete}>
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </button>

      <Modal
        showing={showRenameModal}
        onDismiss={() => {
          setShowRenameModal(false);
        }}
        actionName='Rename'
        onSubmit={() => {
          if (renameInput.current !== null) {
            renameMindMap(renameInput.current.value);
          }
          setShowRenameModal(false);
        }}
      >
        <h2>Rename map</h2>
        <div className="divider" />
        <input type="text" ref={renameInput} placeholder={mindMap.title} />
      </Modal>
    </>
  );
}

export default MindMapMenuButton;
