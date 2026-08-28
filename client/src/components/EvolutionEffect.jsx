import { useEffect } from 'react';
import './EvolutionEffect.css';

const EvolutionEffect = ({ evolutionInfo, onClose }) => {
  const speciesEmojis = {
    dog: '🐶',
    cat: '🐱',
    bird: '🐦',
    rabbit: '🐰',
  };

  const stageNames = {
    baby: 'mladunče 👶',
    child: 'mladić/mlada 👧',
    adult: 'odrastao 🎓',
  };

  useEffect(() => {
    if (!evolutionInfo) return undefined;

    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [evolutionInfo, onClose]);

  if (!evolutionInfo) return null;

  const stageName = stageNames[evolutionInfo.newStage] || evolutionInfo.newStage;
  const petEmoji = speciesEmojis[evolutionInfo.species] || '🐾';

  return (
    <div className="evolution-overlay" onClick={onClose}>
      <div className="evolution-container" onClick={(e) => e.stopPropagation()}>
        <div className="evolution-content">
          {/* Sparkle efekti */}
          <div className="sparkle sparkle-1" />
          <div className="sparkle sparkle-2" />
          <div className="sparkle sparkle-3" />
          <div className="sparkle sparkle-4" />
          <div className="sparkle sparkle-5" />
          <div className="sparkle sparkle-6" />

          {/* Tekst */}
          <div className="evolution-text">
            <div className="evolution-title">🎉 Tvoj ljubimac je odrastao!</div>
            <div className="evolution-stage">Faza: {stageName}</div>
          </div>

          {/* Pet prikaz s animacijom */}
          <div className="evolution-pet-display">
            <div className="evolution-pet-bounce">{petEmoji}</div>
          </div>

          {/* Hint za zatvaranje */}
          <div className="evolution-hint">Klikni ili čekaj 3 sekunde</div>
        </div>
      </div>
    </div>
  );
};

export default EvolutionEffect;
