import { createContext } from 'react';

type Props = {
  selectedNodeId: string | undefined
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | undefined>>
};
const SelectedNodeContext = createContext<Props>({
  selectedNodeId: undefined,
  setSelectedNodeId: () => { },
});

export default SelectedNodeContext;