import { PetProvider, usePet } from '../context/PetContext';
import PetDisplay from './pet/PetDisplay';
import PetStats from './pet/PetStats';
import ActionButtons from './pet/ActionButtons';
import PetDeadScreen from './pet/PetDeadScreen';
import CreatePetFormWizard from './CreatePetFormWizard';
import EvolutionEffect from './EvolutionEffect';
import './pet/PetDashboard.css';

const DashboardContent = () => {
  const {
    petExists,
    petIsDead,
    loading,
    weather,
    weatherCondition,
    isDay,
    weatherOverride,
    dayOverride,
    evolutionInfo,
    setEvolutionInfo,
    setWeatherPreset,
    resetWeatherPreset,
  } = usePet();

  const effectiveIsDay = dayOverride ?? isDay;
  const effectiveCondition = weatherOverride ?? weatherCondition;

  if (loading) {
    return <div className="dashboard-wrapper"><div className="dashboard-empty-state">Učitavanje ljubimca...</div></div>;
  }

  if (petExists === false) {
    return (
      <div className="dashboard-wrapper">
        <CreatePetFormWizard />
      </div>
    );
  }

  if (petIsDead) {
    return <PetDeadScreen />;
  }

  const dayButtons = [
    { label: 'Dan', value: true },
    { label: 'Noć', value: false },
  ];

  const weatherButtons = [
    { label: 'Clear', value: 'Clear' },
    { label: 'Oblaci', value: 'Clouds' },
    { label: 'Kiša', value: 'Rain' },
    { label: 'Snijeg', value: 'Snow' },
    { label: 'Tuča', value: 'Thunderstorm' },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="scene-test-panel">
        <div className="scene-test-group">
          <div className="scene-test-label">Doba dana</div>
          <div className="scene-test-buttons">
            {dayButtons.map((button) => (
              <button
                key={button.label}
                type="button"
                className={`scene-test-btn ${effectiveIsDay === button.value ? 'active' : ''}`}
                onClick={() => setWeatherPreset(effectiveCondition ?? 'Clear', button.value)}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>

        <div className="scene-test-group">
          <div className="scene-test-label">Vrijeme</div>
          <div className="scene-test-buttons">
            {weatherButtons.map((button) => (
              <button
                key={button.label}
                type="button"
                className={`scene-test-btn ${effectiveCondition === button.value ? 'active' : ''}`}
                onClick={() => setWeatherPreset(button.value, effectiveIsDay ?? true)}
              >
                {button.label}
              </button>
            ))}
            <button type="button" className="scene-test-btn scene-test-btn-reset" onClick={resetWeatherPreset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-scene-panel" data-scene={effectiveIsDay ? 'day' : 'night'}>
        <PetDisplay weatherCondition={effectiveCondition} isDay={effectiveIsDay} />
        <ActionButtons />
      </div>

      {weather && (
        (effectiveCondition === 'Rain' || effectiveCondition === 'Drizzle' || effectiveCondition === 'Thunderstorm' || effectiveCondition === 'Snow' || !effectiveIsDay)
      )}
      <div className="dashboard-stats-panel">
        <PetStats />
      </div>

      {/* Evolucija overlay - prikazuje se kad se ljubimac razvija */}
      {evolutionInfo && (
        <EvolutionEffect
          evolutionInfo={evolutionInfo}
          onClose={() => setEvolutionInfo(null)}
        />
      )}
    </div>
  );
};

const Dashboard = () => (
  <PetProvider>
    <DashboardContent />
  </PetProvider>
);

export default Dashboard;
