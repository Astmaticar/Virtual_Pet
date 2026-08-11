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
      {stats.map((stat) => {
        const display = Number.isFinite(stat.value) ? Math.round(stat.value) : 0;
        return (
          <div className="stat-group" key={stat.label}>
            <div className="stat-label">
              <span>{stat.label}</span>
              <strong>{display}%</strong>
            </div>
            <div className="stat-bar">
              <div className="stat-fill" style={{ width: `${display}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PetStats;
