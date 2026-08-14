import { useState } from 'react';
import { PetProvider, usePet } from '../context/PetContext';
import PetDisplay from './pet/PetDisplay';
import PetStats from './pet/PetStats';
import ActionButtons from './pet/ActionButtons';
import PetRunAwayScreen from './pet/PetRunAwayScreen';
import CreatePetFormWizard from './CreatePetFormWizard';
import EvolutionEffect from './EvolutionEffect';
import './pet/PetDashboard.css';

const DashboardContent = () => {
  const { pet, petExists, loading, weather, weatherCondition, isDay, weatherLoading, weatherError, evolutionInfo, setEvolutionInfo } = usePet();
  const [previewIsDay, setPreviewIsDay] = useState(null);
  const [previewCondition, setPreviewCondition] = useState(null);

  const effectiveIsDay = previewIsDay ?? isDay;
  const effectiveCondition = previewCondition ?? weatherCondition;

  const handleTogglePreview = () => {
    setPreviewIsDay((current) => {
      if (current === null) {
        return !isDay;
      }

      return !current;
    });
  };

  const handleConditionChange = (condition) => {
    setPreviewCondition(previewCondition === condition ? null : condition);
  };

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

  return (
    <div className="dashboard-wrapper">
      <div className="weather-widget">
        <div>
          <strong>Vrijeme</strong>
        </div>
        {weather ? (
          <div className="weather-details">
            <span>{Math.round(weather.temperature)}°C</span>
            <span>{weather.description}</span>
          </div>
        ) : weatherLoading ? (
          <div className="weather-details">
            <span>Učitavanje...</span>
          </div>
        ) : (
          <div className="weather-details">
            <span>{weatherError || 'Ne mogu dohvatiti vrijeme.'}</span>
          </div>
        )}
        <button type="button" className="scene-preview-toggle" onClick={handleTogglePreview}>
          {effectiveIsDay ? 'Preview noć' : 'Preview dan'}
        </button>
        <div className="condition-preview-panel">
          <button
            type="button"
            className={`condition-btn ${previewCondition === 'Clear' ? 'active' : ''}`}
            onClick={() => handleConditionChange('Clear')}
          >
            Vedro
          </button>
          <button
            type="button"
            className={`condition-btn ${previewCondition === 'Rain' ? 'active' : ''}`}
            onClick={() => handleConditionChange('Rain')}
          >
            Kiša
          </button>
          <button
            type="button"
            className={`condition-btn ${previewCondition === 'Clouds' ? 'active' : ''}`}
            onClick={() => handleConditionChange('Clouds')}
          >
            Oblačno
          </button>
          <button
            type="button"
            className={`condition-btn ${previewCondition === 'Snow' ? 'active' : ''}`}
            onClick={() => handleConditionChange('Snow')}
          >
            Snijeg
          </button>
        </div>
      </div>
      <div className="dashboard-scene-panel" data-scene={effectiveIsDay ? 'day' : 'night'}>
        <PetDisplay weatherCondition={effectiveCondition} isDay={effectiveIsDay} />
        {pet?.isRunAway && <PetRunAwayScreen />}
        <ActionButtons />
      </div>
      {weather && (
        (weatherCondition === 'Rain' || weatherCondition === 'Drizzle' || weatherCondition === 'Thunderstorm' || weatherCondition === 'Snow' || !isDay)
      ) && <div className="weather-note">Vrijeme je danas promjenjivo, pa je scena prilagođena nebu.</div>}
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
