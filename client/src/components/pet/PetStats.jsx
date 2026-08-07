import { usePet } from '../../context/PetContext';
import './PetStats.css';

const PetStats = () => {
  const { pet, loading } = usePet();

  if (loading) {
    return <div className="pet-stats">Učitavanje statistika...</div>;
  }

  if (!pet) {
    return <div className="pet-stats">Nema statistikа za prikaz.</div>;
  }

  const stats = [
    { label: 'Hunger', value: pet.hunger },
    { label: 'Čistoća', value: pet.cleanliness },
    { label: 'Sreća', value: pet.happiness },
    { label: 'Energija', value: pet.energy },
  ];

  return (
    <div className="pet-stats">
      <div className="stat-row">
        <span>Razina</span>
        <strong>{pet.level}</strong>
      </div>
      <div className="stat-row">
        <span>XP</span>
        <strong>{pet.xp}</strong>
      </div>
      {stats.map((stat) => (
        <div className="stat-group" key={stat.label}>
          <div className="stat-label">
            <span>{stat.label}</span>
            <strong>{stat.value}%</strong>
          </div>
          <div className="stat-bar">
            <div className="stat-fill" style={{ width: `${stat.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetStats;
