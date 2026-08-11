import { useEffect, useState } from 'react';
import { PetProvider, usePet } from '../context/PetContext';
import PetDisplay from './pet/PetDisplay';
import PetStats from './pet/PetStats';
import ActionButtons from './pet/ActionButtons';
import CreatePetForm from './CreatePetForm';
import './pet/PetDashboard.css';

const DashboardContent = () => {
  const { petExists, loading } = usePet();
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await (await import('../services/api')).default.get('/weather');
        setWeather(response.data);
      } catch (err) {
        setWeatherError('Ne mogu dohvatiti vrijeme.');
      }
    };

    fetchWeather();
  }, []);

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
      <div className="weather-widget">
        <div>
          <strong>Vrijeme</strong>
        </div>
        {weather ? (
          <div className="weather-details">
            <span>{Math.round(weather.temperature)}°C</span>
            <span>{weather.description}</span>
          </div>
        ) : (
          <div className="weather-details">
            <span>{weatherError || 'Učitavanje...'}</span>
          </div>
        )}
      </div>
      <div className="dashboard-scene-panel">
        <PetDisplay />
        <ActionButtons />
      </div>
      {weather && (weather.temperature < 5 || (weather.description || '').toLowerCase().includes('rain') || (weather.description || '').toLowerCase().includes('kiša')) && (
        <div className="weather-note">Vrijeme je loše, tvoj ljubimac je danas malo tužniji.</div>
      )}
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
