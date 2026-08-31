import { usePet } from '../../context/PetContext';
import './CareEffect.css';

const CareEffect = () => {
  const { actionEffect, pet } = usePet();

  if (!actionEffect) {
    return null;
  }

  // Prilagodi poziciju efekta ovisno o fazi rasta
  const getPositionByGrowthStage = () => {
    switch (pet?.growthStage) {
      case 'baby':
        return {
          centerLeft: 45,
          centerTop: 45,
          leftVariance: 20,
          topVariance: 15,
        };
      case 'child':
        return {
          centerLeft: 48,
          centerTop: 48,
          leftVariance: 24,
          topVariance: 18,
        };
      case 'adult':
        return {
          centerLeft: 50,
          centerTop: 50,
          leftVariance: 28,
          topVariance: 22,
        };
      default:
        return {
          centerLeft: 45,
          centerTop: 45,
          leftVariance: 20,
          topVariance: 15,
        };
    }
  };

  const getEffectElements = () => {
    const pos = getPositionByGrowthStage();

    switch (actionEffect) {
      case 'feed':
        return Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`heart-${i}`}
            className="care-effect-particle heart"
            style={{
              left: `${pos.centerLeft + (Math.random() - 0.5) * pos.leftVariance}%`,
              top: `${pos.centerTop + (Math.random() - 0.5) * pos.topVariance}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            ❤️
          </div>
        ));
      case 'play':
        return [
          <div
            key="play-main"
            className="care-effect-particle sparkle"
            style={{
              left: `${pos.centerLeft}%`,
              top: `${Math.min(72, pos.centerTop + 10)}%`,
              animationDelay: '0s',
              fontSize: '2.3rem',
              transform: 'translate(-50%, -50%)',
            }}
          >
            🧸
          </div>,
        ];
      case 'clean':
        return Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`bubble-${i}`}
            className="care-effect-particle bubble"
            style={{
              left: `${pos.centerLeft + (Math.random() - 0.5) * pos.leftVariance}%`,
              top: `${pos.centerTop + (Math.random() - 0.5) * pos.topVariance}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            🫧
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="care-effect-container">
      {getEffectElements()}
    </div>
  );
};

export default CareEffect;
