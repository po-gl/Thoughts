import { useContext } from 'react';
import './styles/ProgressIndicator.css';
import ProgressContext from '../context/ProgressContext.ts';

function ProgressIndicator() {

  const { inProgress } = useContext(ProgressContext);

  return (
    <div className={`progress ${inProgress ? '' : 'hidden'}`} >
      <h3>Generation in progress...</h3>
      <h4>~1min</h4>
    </div>
  );
}

export default ProgressIndicator;
