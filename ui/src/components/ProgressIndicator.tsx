import { useContext } from 'react';
import './styles/ProgressIndicator.css'
import ProgressContext from '../context/ProgressContext';

function ProgressIndicator() {

  const { inProgress } = useContext(ProgressContext);

  return (
    <div className={`progress ${inProgress ? '' : 'hidden'}`} >
      <h3>Generation in progress...</h3>
    </div >
  );
}

export default ProgressIndicator;
