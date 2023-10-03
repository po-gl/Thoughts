import { ObjectId } from 'mongodb';
import MindMapMenuButton from './MindMapMenuButton';
import { useSearchParams } from 'react-router-dom';

export type MindMap = {
  _id: ObjectId;
  user: string;
  created: Date;
  modified: Date;
  deleted?: Date;
  title: string;
  description: string;
  graph: string;
};

type Props = {
  savedMaps: MindMap[]
  setMainMenuIsShowing: React.Dispatch<React.SetStateAction<boolean>>
  setShouldRefreshMaps: React.Dispatch<React.SetStateAction<boolean>>
};
function MindMapList({ savedMaps, setMainMenuIsShowing, setShouldRefreshMaps }: Props) {
  const [, setSearchParams] = useSearchParams();

  const mapList = savedMaps.map((mindMap) => (
    <MindMapMenuButton
      key={mindMap._id.toString()}
      mindMap={mindMap}
      setShouldRefreshMaps={setShouldRefreshMaps}
      onPress={async () => {
        setMainMenuIsShowing(false);
        setSearchParams({ map: mindMap._id.toString() });
      }}
    />
  ));

  return (
    <>
      {mapList}
    </>
  );
}

export default MindMapList;