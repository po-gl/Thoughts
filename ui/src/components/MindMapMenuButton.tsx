import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'react-router-dom';
import { useReactFlow } from 'reactflow';
import { apiFetch } from '../utils/api';
import { MindMap } from './MindMapList';
import './styles/MenuButton.css';
import './styles/MindMapMenuButton.css';

type Props = {
  mindMap: MindMap;
  onPress: () => void;
  setShouldRefreshMaps: React.Dispatch<React.SetStateAction<boolean>>;
}
function MindMapMenuButton({ mindMap, onPress, setShouldRefreshMaps }: Props) {
  const reactFlowInstance = useReactFlow();
  const [, setSearchParams] = useSearchParams();

  const onRename = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

  }, []);

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

  return (
    <button className="menu-button mindmap-button" onClick={onPress} >
      <div className="menu-text" >
        {`${mindMap.title} ${mindMap._id.toString().slice(-10)}`}
      </div>
      <div className="inner-buttons">
        <button className="inner-button" onClick={onRename}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button className="inner-button" onClick={onDelete}>
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    </button >
  );
}

export default MindMapMenuButton;