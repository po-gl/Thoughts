import { ObjectId } from "mongodb";
import MindMapMenuButton from "./MindMapMenuButton";
import { useSearchParams } from "react-router-dom";

export type MindMap = {
  _id: ObjectId;
  user: string;
  created: Date;
  modified: Date;
  deleted?: Date;
  title: string;
  description: string;
  graph: string;
}

type Props = {
  savedMaps: MindMap[]
}
function MindMapList({ savedMaps }: Props) {
  const [, setSearchParams] = useSearchParams();

  const mapList = savedMaps.map((mindMap) => (
    <MindMapMenuButton
      key={mindMap._id.toString()}
      mindMap={mindMap}
      onPress={async () => {
        setSearchParams({ map: mindMap._id.toString() });
      }}
    />
  ))

  return (
    <>
      {mapList}
    </>
  );
}

export default MindMapList