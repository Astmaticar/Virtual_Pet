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

  const effectiveIsDay = isDay;
  const effectiveCondition = weatherCondition;

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
      <div className="dashboard-scene-panel" data-scene={effectiveIsDay ? 'day' : 'night'}>
        <PetDisplay weatherCondition={effectiveCondition} isDay={effectiveIsDay} />
        {pet?.isRunAway && <PetRunAwayScreen />}
        <ActionButtons />
      </div>
      {weather && (
        (weatherCondition === 'Rain' || weatherCondition === 'Drizzle' || weatherCondition === 'Thunderstorm' || weatherCondition === 'Snow' || !isDay)
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
