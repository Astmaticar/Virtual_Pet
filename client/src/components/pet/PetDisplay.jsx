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

  const statsAverage = (pet.hunger + pet.cleanliness + pet.happiness + pet.energy) / 4;
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
            <div className="pet-sun" />
          </div>

          <div className="pet-figure-wrap">
            <div className="pet-face">{face}</div>
            <div className="pet-caption">
              <div className="pet-name">{pet.name}</div>
              <div className="pet-mood">😊 {moodText}</div>
              <div className="pet-badge">Nivo {pet.level} · {pet.xp} XP</div>
            </div>
          </div>

          <div className="pet-ground" aria-hidden="true">
            <div className="pet-platform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDisplay;
