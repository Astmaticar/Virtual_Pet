import { usePet } from '../../context/PetContext';
import './ActionButtons.css';

const ActionButtons = () => {
  const { feed, clean, play, actionLoading } = usePet();

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
