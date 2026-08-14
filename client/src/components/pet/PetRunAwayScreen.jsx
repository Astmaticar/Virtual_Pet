import { usePet } from '../../context/PetContext';
import './PetRunAwayScreen.css';

const PetRunAwayScreen = () => {
  const { pet, forgivePet, deletePet, actionLoading } = usePet();

  if (!pet || !pet.isRunAway) {
    return null;
  }

  const isMalePet = pet.gender === 'male';
  const runawayTitle = isMalePet ? `${pet.name} je pobjegao! 😢` : `${pet.name} je pobjegla! 😢`;
  const forgiveText = isMalePet
    ? 'Možeš ga pronaći i pozvati natrag, ili početi ispočetka s novim ljubimcem.'
    : 'Možeš ju pronaći i pozvati natrag, ili početi ispočetka s novim ljubimcem.';
  const forgiveButtonText = isMalePet ? 'Pozovi ga nazad' : 'Pozovi je natrag';
  const forgiveButtonAriaLabel = isMalePet ? 'Pozovi ga nazad' : 'Pozovi je natrag';

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
          <h2 className="runaway-title">{runawayTitle}</h2>
        </div>

        <div className="runaway-message">
          <p>
            {pet.message || 'Tvoj ljubimac je bio zanemaran i otišao je iz kuće. Ali nije prešišten! Još se možeš pomiriti s njim...'}
          </p>
        </div>

        <div className="runaway-description">
          <p>{forgiveText}</p>
        </div>

        <div className="runaway-actions">
          <button
            type="button"
            onClick={handleForgive}
            disabled={actionLoading}
            className="runaway-button runaway-button--forgive"
            aria-label={forgiveButtonAriaLabel}
          >
            <span className="runaway-button-emoji">🥺</span>
            <span className="runaway-button-text">{forgiveButtonText}</span>
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
            {pet.name} te nikad neće zaboraviti... ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetRunAwayScreen;
