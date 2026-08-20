import { usePet } from '../../context/PetContext';
import './PetDeadScreen.css';

const PetDeadScreen = () => {
  const { pet, deletePet, actionLoading } = usePet();

  if (!pet) {
    return null;
  }

  const handleCreateNew = async () => {
    await deletePet();
  };

  return (
    <div className="dead-screen">
      <div className="dead-overlay" />

      <div className="dead-device-frame">
        <div className="dead-container">
          <div className="dead-header">
            <div className="dead-icon">😢</div>
            <h2 className="dead-title">{pet.name} te je napustio</h2>
          </div>

          <div className="dead-message">
            <p>Tvoj ljubimac te je napustio jer je bio predugo zanemaren 😢</p>
          </div>

          <div className="dead-actions">
            <button
              type="button"
              onClick={handleCreateNew}
              disabled={actionLoading}
              className="dead-button"
              aria-label="Stvori novog ljubimca"
            >
              <span className="dead-button-emoji">🐾</span>
              <span className="dead-button-text">Stvori novog ljubimca</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDeadScreen;