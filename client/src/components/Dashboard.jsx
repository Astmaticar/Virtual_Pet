import { useEffect, useState } from 'react';
import api from '../services/api';
import { PetProvider } from '../context/PetContext';
import PetDisplay from './pet/PetDisplay';
import PetStats from './pet/PetStats';
import ActionButtons from './pet/ActionButtons';
import './pet/PetDashboard.css';

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await api.get('/weather');
        setWeather(response.data);
      } catch (err) {
        setWeatherError('Ne mogu dohvatiti vrijeme.');
      }
    };

    fetchWeather();
  }, []);

  const isBadWeather = () => {
    if (!weather) {
      return false;
    }

    const description = weather.description?.toLowerCase() || '';
    return weather.temperature < 5 || description.includes('rain') || description.includes('kiša');
  };

  return (
    <PetProvider>
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
        <div className="dashboard-grid">
          <div>
            <PetDisplay />
            {isBadWeather() && (
              <div className="weather-note">
                Vrijeme je loše, tvoj ljubimac je danas malo tužniji.
              </div>
            )}
          </div>
          <PetStats />
        </div>
        <ActionButtons />
      </div>
    </PetProvider>
  );
};

export default Dashboard;
