import { createContext } from 'react';

export type Progress = {
  inProgress: boolean
  setInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  estimatedTimeS: number
  setEstimatedTimeS: React.Dispatch<React.SetStateAction<number>>,
};

const ProgressContext = createContext<Progress>({
  inProgress: false,
  setInProgress: () => { },
  estimatedTimeS: 0,
  setEstimatedTimeS: () => { },
});

export default ProgressContext;
