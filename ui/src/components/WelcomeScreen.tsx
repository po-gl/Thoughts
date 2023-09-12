import './styles/WelcomeScreen.css';
import hintArrow from '../assets/hint-arrow.svg';

function WelcomeScreen() {
  return (
    <div className="welcome-screen">
      <div className="controls-panel-hint">
        <img className="hint-arrow" src={hintArrow} />
        <h3>Start here!</h3>
      </div>

      <div className="center">
        <h1>Thoughts 💡</h1>
        <p>Generate a map of your thoughts using GPT-4</p>
        <p>Enter a list of what's on your mind, and the large language model will connect the dots and add new ones.</p>
      </div>
    </div>
  );
}

export default WelcomeScreen;