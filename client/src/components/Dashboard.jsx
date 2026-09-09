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
    pet,
    petExists,
    petIsDead,
    loading,
    actionLoading,
    weather,
    weatherCondition,
    isDay,
    weatherOverride,
    dayOverride,
    evolutionInfo,
    setEvolutionInfo,
    setWeatherPreset,
    resetWeatherPreset,
    addExperience,
    decreaseStatForTest,
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

  const experienceButtons = [5, 25, 100];
  const growthStageLabels = {
    baby: 'Beba',
    child: 'Dijete',
    adult: 'Odrasli',
  };

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

        <div className="scene-test-group scene-test-group-xp">
          <div className="scene-test-label">Faza života</div>
          <div className="scene-test-xp-status">
            <strong>{growthStageLabels[pet.growthStage] || pet.growthStage}</strong>
            <span>{pet.xp || 0} XP · Level {pet.level || 1}</span>
          </div>
          <div className="scene-test-buttons">
            {experienceButtons.map((amount) => (
              <button
                key={amount}
                type="button"
                className="scene-test-btn scene-test-btn-xp"
                onClick={() => addExperience(amount)}
              >
                +{amount} XP
              </button>
            ))}
          </div>

          <div className="scene-test-group scene-test-group-xp">
            <div className="scene-test-label">Test zanemarivanja</div>
            <div className="scene-test-buttons">
              <button
                type="button"
                className="scene-test-btn scene-test-btn-xp"
                onClick={() => decreaseStatForTest('hunger')}
                disabled={actionLoading}
              >
                -20 Glad
              </button>
              <button
                type="button"
                className="scene-test-btn scene-test-btn-xp"
                onClick={() => decreaseStatForTest('cleanliness')}
                disabled={actionLoading}
              >
                -20 Čistoća
              </button>
              <button
                type="button"
                className="scene-test-btn scene-test-btn-xp"
                onClick={() => decreaseStatForTest('happiness')}
                disabled={actionLoading}
              >
                -20 Sreća
              </button>
            </div>
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
