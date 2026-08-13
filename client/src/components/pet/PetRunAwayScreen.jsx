import { usePet } from '../../context/PetContext';
import './PetRunAwayScreen.css';

const PetRunAwayScreen = () => {
  const { pet, runAwayInfo, forgivePet, deletePet, actionLoading } = usePet();
  const isRunAway = runAwayInfo?.isRunAway || pet?.isRunAway;

  if (!isRunAway) {
    return null;
  }

  const handleForgive = async () => {
    const result = await forgivePet();
    if (result?.success) {
      // Pet je vraćen s resetiranim statovima
    }
  };

  const handleCreateNew = async () => {
    const result = await deletePet();
    if (result?.success) {
      // Korisnik će vidjeti wizard za novog ljubimca
    }
  };

  return (
    <div className="runaway-screen">
      <div className="runaway-overlay" />
      
      <div className="runaway-container">
        <div className="runaway-header">
          <div className="runaway-icon">🏃</div>
          <h2 className="runaway-title">{pet.name} je pobjegao! 😢</h2>
        </div>

        <div className="runaway-message">
          <p>
            Tvoj ljubimac je bio zanemaran i otišao je iz kuće. 
            Ali nije prešišten! Još se možeš pomiriti s njim...
          </p>
        </div>

        <div className="runaway-description">
          <p>Možeš mu oprostiti i pozvati ga natrag, ili početi ispočetka s novim ljubimcem.</p>
        </div>

        <div className="runaway-actions">
          <button
            type="button"
            onClick={handleForgive}
            disabled={actionLoading}
            className="runaway-button runaway-button--forgive"
            aria-label="Pozovi ga nazad"
          >
            <span className="runaway-button-emoji">🥺</span>
            <span className="runaway-button-text">Pozovi ga nazad</span>
          </button>

          <button
            type="button"
            onClick={handleCreateNew}
            disabled={actionLoading}
            className="runaway-button runaway-button--new"
            aria-label="Stvori novog ljubimca"
          >
            <span className="runaway-button-emoji">🐾</span>
            <span className="runaway-button-text">Stvori novog ljubimca</span>
          </button>
        </div>

        <div className="runaway-footer">
          <p className="runaway-footer-text">
            Level: {pet.level} · {pet.name} te nikad neće zaboraviti... ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetRunAwayScreen;
