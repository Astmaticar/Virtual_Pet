import { useEffect, useState } from 'react';
import { usePet } from '../../context/PetContext';
import './PetDisplay.css';

const getSceneVariant = (condition, isDay) => {
  const normalizedCondition = (condition || 'Clear').toLowerCase();

  if (normalizedCondition === 'rain' || normalizedCondition === 'drizzle' || normalizedCondition === 'thunderstorm') {
    return isDay ? `scene--rain scene--day` : 'scene--rain scene--night';
  }

  if (normalizedCondition === 'snow') {
    return isDay ? `scene--snow scene--day` : 'scene--snow scene--night';
  }

  if (normalizedCondition === 'clouds') {
    return isDay ? `scene--clouds scene--day` : 'scene--clouds scene--night';
  }

  return isDay ? 'scene--clear scene--day' : 'scene--clear scene--night';
};

const getCloudCount = (condition) => {
  const normalizedCondition = (condition || 'Clear').toLowerCase();

  if (normalizedCondition === 'clouds') {
    return 6;
  }

  if (normalizedCondition === 'rain' || normalizedCondition === 'drizzle' || normalizedCondition === 'thunderstorm' || normalizedCondition === 'snow') {
    return 4;
  }

  return 3;
};

const getRainCount = (condition) => {
  const normalizedCondition = (condition || 'Clear').toLowerCase();

  if (normalizedCondition === 'thunderstorm') {
    return 26;
  }

  if (normalizedCondition === 'rain') {
    return 18;
  }

  return 12;
};

const getSnowCount = () => 18;

const cloudClassNames = ['cloud-one', 'cloud-two', 'cloud-three', 'cloud-4', 'cloud-5', 'cloud-6'];

// Mood helper functions
const getMood = (statsAverage) => {
  if (statsAverage > 70) {
    return 'happy';
  }
  if (statsAverage < 30) {
    return 'sad';
  }
  return 'neutral';
};

const getMoodText = (mood) => {
  const moodTexts = {
    happy: 'Sretan',
    neutral: 'Neutralan',
    sad: 'Tužan',
  };
  return moodTexts[mood] || 'Neutralan';
};

const getMoodEmoji = (mood) => {
  const moodEmojis = {
    happy: '😄',
    neutral: '😐',
    sad: '😢',
  };
  return moodEmojis[mood] || '😐';
};

const getPetImageByGrowthStage = (species, variant, growthStage) => {
  // Vraća path do slike ljubimca na temelju vrste, boje i faze rasta
  // Očekivane datoteke: /src/assets/pets/{species}-{variant}-{baby/child/adult}.png
  return `/src/assets/pets/${species}-${variant}-${growthStage}.png`;
};

const PetDisplay = ({ weatherCondition, isDay = true }) => {
  const { pet, loading } = usePet();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!pet) {
      return;
    }

    setImageError(false);
  }, [pet, pet?.species, pet?.growthStage, pet?.variant, pet?.hunger, pet?.cleanliness, pet?.happiness, pet?.energy]);

  if (loading) {
    return <div className="pet-display">Učitavanje ljubimca...</div>;
  }

  if (!pet) {
    return <div className="pet-display">Nema ljubimca za prikaz.</div>;
  }

  const statsAverage = (pet.hunger + pet.cleanliness + pet.happiness + pet.energy) / 4;
  const mood = getMood(statsAverage);
  const moodText = getMoodText(mood);
  const moodEmoji = getMoodEmoji(mood);

  const getFallbackEmoji = (species) => {
    const emojiMap = {
      dog: '🐶',
      cat: '🐱',
      bird: '🐦',
      rabbit: '🐰',
    };

    return emojiMap[species] || '🐾';
  };

  const sceneVariant = getSceneVariant(weatherCondition, isDay);
  const cloudCount = getCloudCount(weatherCondition);
  const weatherType = (weatherCondition || 'Clear').toLowerCase();
  const showNight = isDay === false;
  const showRain = weatherType === 'rain' || weatherType === 'drizzle' || weatherType === 'thunderstorm';
  const showSnow = weatherType === 'snow';
  const showClouds = true; // Pokazuj oblake za sve vremenske uvjete - čak i za vedro
  const rainCount = getRainCount(weatherCondition);
  const snowCount = getSnowCount();

  const rainElements = showRain ? Array.from({ length: rainCount }).map((_, i) => (
    <div
      key={`rain-${i}`}
      className="rain-drop"
      style={{
        left: `${(i * 5.5) % 100}%`,
        animationDelay: `${(i % 6) * 0.15}s`,
      }}
    />
  )) : null;

  const snowElements = showSnow ? Array.from({ length: snowCount }).map((_, i) => {
    // Pseudo-random raspored koristeći sinus za deterministički, rasparseniji raspored
    const randomOffset = Math.sin(i * 12.9898) * 50 + 50;
    return (
      <div
        key={`snow-${i}`}
        className="snow-particle"
        style={{
          left: `${randomOffset}%`,
          animationDelay: `${(i % 7) * 0.25}s`,
        }}
      />
    );
  }) : null;

  const fallbackEmoji = getFallbackEmoji(pet.species);

  return (
    <div className={`pet-display growth-${pet.growthStage} scene-${weatherType} ${showRain ? 'scene-rain' : ''} ${showSnow ? 'scene-snow' : ''} ${weatherType === 'clouds' ? 'scene-clouds' : ''}`}>
      <div className="pet-device-frame">
        <div className={`pet-screen ${sceneVariant}`}>
          <div className="pet-sky" aria-hidden="true">
            {rainElements}
            {snowElements}
            {showNight ? <div className="pet-moon" /> : <div className="pet-sun" />}

            {showNight && (
              <>
                <span className="pet-star star-a" />
                <span className="pet-star star-b" />
                <span className="pet-star star-c" />
                <span className="pet-star star-d" />
                <span className="pet-star star-e" />
              </>
            )}

            {showClouds && (
              <>
                {Array.from({ length: cloudCount }).map((_, index) => (
                  <div
                    key={`cloud-${index}`}
                    className={`pet-cloud ${cloudClassNames[index]} ${showNight ? 'pet-cloud--night' : ''} ${showRain ? 'pet-cloud--rain' : ''} ${showSnow ? 'pet-cloud--snow' : ''}`}
                  />
                ))}
              </>
            )}

            {showRain && (
              <div className="pet-weather-layer pet-rain-layer" aria-hidden="true">
                {Array.from({ length: rainCount }).map((_, index) => (
                  <span
                    key={`rain-${index}`}
                    className="pet-rain-drop"
                    style={{
                      left: `${(index * 6) % 100}%`,
                      animationDelay: `${(index % 7) * 0.16}s`,
                      animationDuration: `${0.9 + (index % 4) * 0.12}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {showSnow && (
              <div className="pet-weather-layer pet-snow-layer" aria-hidden="true">
                {Array.from({ length: snowCount }).map((_, index) => (
                  <span
                    key={`snow-${index}`}
                    className="pet-snow-flake"
                    style={{
                      left: `${(index * 7) % 100}%`,
                      animationDelay: `${(index % 8) * 0.22}s`,
                      animationDuration: `${3.8 + (index % 5) * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            )}

            {weatherType === 'thunderstorm' && <div className="pet-lightning-flash" aria-hidden="true" />}
          </div>

          <div className="pet-side-decoration pet-flower" aria-hidden="true">
            <span className="pet-flower-petal pet-flower-petal-a" />
            <span className="pet-flower-petal pet-flower-petal-b" />
            <span className="pet-flower-petal pet-flower-petal-c" />
            <span className="pet-flower-petal pet-flower-petal-d" />
            <span className="pet-flower-center" />
          </div>

          <div className="pet-side-decoration pet-rock" aria-hidden="true" />

          <div className="pet-figure-wrap">
            {imageError ? (
              <div className="pet-face pet-face-emoji">{fallbackEmoji}</div>
            ) : (
              <img
                key={`${pet.species}-${pet.variant}-${pet.growthStage}`}
                src={getPetImageByGrowthStage(pet.species, pet.variant, pet.growthStage)}
                alt={`${pet.name} - ${pet.growthStage}`}
                className="pet-face"
                onError={() => setImageError(true)}
              />
            )}
            <div className="pet-caption">
              <div className="pet-name">{pet.name}</div>
              <div className="pet-mood">{moodEmoji} {moodText}</div>
              <div className="pet-badge">Lvl {pet.level} · {pet.xp} XP</div>
            </div>
          </div>

          <div className="pet-ground" aria-hidden="true">
            <div className="pet-grass-band" />
            <div className="pet-grass-blade pet-grass-blade-a" />
            <div className="pet-grass-blade pet-grass-blade-b" />
            <div className="pet-grass-blade pet-grass-blade-c" />
            <div className="pet-grass-blade pet-grass-blade-d" />
            <div className="pet-platform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDisplay;
