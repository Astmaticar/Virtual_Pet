import { usePet } from '../../context/PetContext';
import PetRunAwayScreen from './PetRunAwayScreen';
import './ActionButtons.css';

const ActionButtons = () => {
  const { runAwayInfo, pet, feed, clean, play, actionLoading } = usePet();

  // Ako je pet pobjegao, prikaži PetRunAwayScreen umjesto normalnih gumba
  if (runAwayInfo?.isRunAway || pet?.isRunAway) {
    return <PetRunAwayScreen />;
  }

  return (
    <div className="action-buttons">
      <div className="action-item">
        <button type="button" onClick={feed} disabled={actionLoading} aria-label="Nahrani ljubimca">
          <span aria-hidden="true">🍖</span>
        </button>
        <span className="action-label">Nahrani</span>
      </div>
      <div className="action-item">
        <button type="button" onClick={clean} disabled={actionLoading} aria-label="Očisti ljubimca">
          <span aria-hidden="true">🧼</span>
        </button>
        <span className="action-label">Očisti</span>
      </div>
      <div className="action-item">
        <button type="button" onClick={play} disabled={actionLoading} aria-label="Igraj se s ljubimcem">
          <span aria-hidden="true">🎾</span>
        </button>
        <span className="action-label">Igraj se</span>
      </div>
    </div>
  );
};

export default ActionButtons;
