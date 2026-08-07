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
      <h2>{pet.name}</h2>
      <div className="pet-face">{face}</div>
      <div className="pet-mood">{moodText}</div>
      <div className="pet-level">Razina: {pet.level} • XP: {pet.xp}</div>
    </div>
  );
};

export default PetDisplay;
