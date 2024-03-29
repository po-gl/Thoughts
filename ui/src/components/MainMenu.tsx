import { useCallback, useContext, useEffect, useState } from 'react';
import { Panel, useReactFlow } from 'reactflow';
import { faBarsStaggered, faSave, faUserCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/MainMenu.css';
import DropdownMenu from './DropdownMenu.tsx';
import MenuButton from './MenuButton.tsx';
import HistoryContext from '../context/HistoryContext.ts';
import { apiFetch } from '../utils/api.ts';
import toast from 'react-hot-toast';
import MindMapList, { MindMap } from './MindMapList.tsx';
import { useSearchParams } from 'react-router-dom';
import SignInModal from './SignInModal.tsx';

function MainMenuButton({ onPress }: { onPress: () => void }) {
  return (
    <Panel position="top-left" className="main-menu-button-panel">
      <button onClick={() => onPress()}>
        <FontAwesomeIcon icon={faBarsStaggered} />
      </button>
    </Panel>
  );
}

type Props = {
  user: User | undefined;
  setShouldRefreshMaps: React.Dispatch<React.SetStateAction<boolean>>;
};
function SaveMapButton({ user, setShouldRefreshMaps }: Props) {
  const reactFlowInstance = useReactFlow();
  const [, setSearchParams] = useSearchParams();

  const saveMap = useCallback(async () => {
    const mindmap = {
      graph: JSON.stringify(reactFlowInstance.toObject()),
    };
    const response = await apiFetch('/maps', 'POST', { mindmap });
    const body = await response.text();
    const result = JSON.parse(body);

    if (result.error === undefined) {
      toast.success('Map saved.');
      const id = result.savedMap._id.toString();
      setSearchParams({ map: id });
      setShouldRefreshMaps(true);
    } else {
      toast.error('There was an error saving the map.');
    }

  }, [reactFlowInstance, setShouldRefreshMaps, setSearchParams]);

  return (
    <MenuButton text="Save as new map"
      onPress={saveMap}
      icon={<FontAwesomeIcon icon={faSave} />}
      disabled={!user?.signedIn ?? true}
    />
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

export type User = {
  name?: string
  signedIn: boolean
};

function MainMenu() {
  const [showing, setIsShowing] = useState(false);
  const [user, setUser] = useState<User>();
  const [savedMaps, setSavedMaps] = useState<MindMap[]>([]);
  const [shouldRefreshMaps, setShouldRefreshMaps] = useState(false);

  const [showingSignInModal, setShowingSignInModal] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setSavedMaps([]);
      const response = await apiFetch('/maps', 'GET');
      if (!ignore) {
        const body = await response.text();
        const result = JSON.parse(body);
        if (result.error === undefined) {
          setSavedMaps(result);
        }
      }
    };
    fetchData();

    const fetchUser = async () => {
      const response = await apiFetch('/auth/user', 'GET');
      if (!ignore) {
        const body = await response.text();
        const result = JSON.parse(body);
        if (result.error === undefined) {
          setUser({ signedIn: result.signedIn, name: result.name });
        }
      }
    };
    fetchUser();

    setShouldRefreshMaps(false);
    return () => {
      ignore = true;
    };
  }, [shouldRefreshMaps]);

  return (
    <>
      <MainMenuButton onPress={() => setIsShowing(prev => !prev)} />

      <DropdownMenu showing={showing}>
        <Panel
          position="top-left"
          className="main-menu-panel"
          style={{ top: '2.9em' }}
        >
          <MenuButton text={ user?.name ?? 'Sign in'}
            onPress={() => setShowingSignInModal(true)}
            icon={<FontAwesomeIcon icon={faUserCircle}/>}
          />
          <SignInModal
            showing={showingSignInModal}
            setShowing={setShowingSignInModal}
            user={user}
            setUser={setUser}
            setShouldRefreshMaps={setShouldRefreshMaps}
          />
          <div className="divider" />
          <div className="mindmap-list">
            <MindMapList
              savedMaps={savedMaps}
              setMainMenuIsShowing={setIsShowing}
              setShouldRefreshMaps={setShouldRefreshMaps}
            />
          </div>
          { savedMaps.length > 0 && 
            <div className="list-divider" />
          }
          <SaveMapButton user={user} setShouldRefreshMaps={setShouldRefreshMaps} />
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
