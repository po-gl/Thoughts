import { createContext } from "react";
import { HistoryState } from "./useHistory";

type HistoryContextProps = {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  updateHistory: (history: HistoryState) => void;
}

const HistoryContext = createContext<HistoryContextProps>({
  undo: () => { },
  redo: () => { },
  canUndo: false,
  canRedo: false,
  updateHistory: () => { }
});

export default HistoryContext;