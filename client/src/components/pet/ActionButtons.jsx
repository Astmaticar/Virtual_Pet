import { usePet } from '../../context/PetContext';
import './ActionButtons.css';

const ActionButtons = () => {
  const { pet, feed, clean, play, actionLoading } = usePet();

  const feedDisabled = actionLoading || !pet || Math.round(pet.hunger) >= 100;
  const cleanDisabled = actionLoading || !pet || Math.round(pet.cleanliness) >= 100;
  const playDisabled = actionLoading || !pet || Math.round(pet.energy) <= 0;

  return (
    <div className="action-buttons">
      <div className="action-item">
        <button type="button" onClick={feed} disabled={feedDisabled} aria-label="Nahrani ljubimca">
          <img src="/hamby.png" alt="Hamburger" className="action-button-image" />
        </button>
        <span className="action-label">Nahrani</span>
      </div>
      <div className="action-item">
        <button type="button" onClick={clean} disabled={cleanDisabled} aria-label="Očisti ljubimca">
          <img src="/soap.png" alt="Soap" className="action-button-image" />
        </button>
        <span className="action-label">Očisti</span>
      </div>
      <div className="action-item">
        <button type="button" onClick={play} disabled={playDisabled} aria-label="Igraj se s ljubimcem">
          <img src="/ball.png" alt="Ball" className="action-button-image" />
        </button>
        <span className="action-label">Igraj se</span>
      </div>
    </div>
  );
};

export default ActionButtons;
