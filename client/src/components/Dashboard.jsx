import { useEffect, useState } from 'react';
import { PetProvider, usePet } from '../context/PetContext';
import PetDisplay from './pet/PetDisplay';
import PetStats from './pet/PetStats';
import ActionButtons from './pet/ActionButtons';
import CreatePetForm from './CreatePetForm';
import './pet/PetDashboard.css';

const DashboardContent = () => {
  const { petExists, loading } = usePet();

  if (loading) {
    return <div className="dashboard-wrapper"><div className="dashboard-empty-state">Učitavanje ljubimca...</div></div>;
  }

  if (petExists === false) {
    return (
      <div className="dashboard-wrapper">
        <CreatePetForm />
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-scene-panel">
        <PetDisplay />
        <ActionButtons />
      </div>
      <div className="dashboard-stats-panel">
        <PetStats />
      </div>
    </div>
  );
};

const Dashboard = () => (
  <PetProvider>
    <DashboardContent />
  </PetProvider>
);

export default Dashboard;
