import { usePet } from '../../context/PetContext';
import './PetDisplay.css';

const PetDisplay = () => {
  const { pet, loading } = usePet();

  if (loading) {
    return <div className="pet-display">Učitavanje ljubimca...</div>;
  }

  if (!pet) {
    return <div className="pet-display">Nema ljubimca za prikaz.</div>;
  }

  const roundedStats = [pet.hunger, pet.cleanliness, pet.happiness, pet.energy].map((v) =>
    Number.isFinite(v) ? Math.round(v) : 0
  );
  const statsAverage = (roundedStats.reduce((s, n) => s + n, 0) / roundedStats.length) || 0;
  let face = '😐';
  let moodText = 'Neutralan';

  if (statsAverage > 70) {
    face = '😄';
    moodText = 'Sretan';
  } else if (statsAverage < 30) {
    face = '😢';
    moodText = 'Tužan';
  }

  return (
    <div className="pet-display">
      <div className="pet-device-frame">
        <div className="pet-screen">
          <div className="pet-sky" aria-hidden="true">
            <div className="pet-cloud cloud-one" />
            <div className="pet-cloud cloud-two" />
            <div className="pet-cloud cloud-three" />
            <div className="pet-sun" />
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
            <div className="pet-shadow" aria-hidden="true" />
            <div className="pet-face">{face}</div>
            <div className="pet-caption">
              <div className="pet-name">{pet.name}</div>
              <div className="pet-mood">😊 {moodText}</div>
              <div className="pet-badge">Nivo {pet.level} · {pet.xp} XP</div>
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
