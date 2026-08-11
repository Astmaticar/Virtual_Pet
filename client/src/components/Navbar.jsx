import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Navbar.css';

const getWeatherIcon = (description = '', temperature = 0) => {
  const text = description.toLowerCase();

  if (text.includes('rain') || text.includes('kiša') || text.includes('storm')) {
    return { icon: '🌧️' };
  }

  if (text.includes('cloud') || text.includes('oblak')) {
    return { icon: '☁️' };
  }

  if (temperature <= 5) {
    return { icon: '❄️' };
  }

  return { icon: '☀️' };
};

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await api.get('/weather');
        setWeather(response.data);
      } catch (err) {
        setWeather(null);
      }
    };

    fetchWeather();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const weatherDisplay = weather ? getWeatherIcon(weather.description, weather.temperature) : null;

  return (
    <nav className="navbar">
      <div className="navbar-shell">
        <Link className="navbar-brand" to="/">
          Virtualni ljubimac
        </Link>

        <div className="navbar-actions">
          {weatherDisplay && (
            <div className="navbar-weather" title="Trenutno vrijeme">
              <span className="navbar-weather-icon">{weatherDisplay.icon}</span>
              <span className="navbar-weather-temp">{Math.round(weather.temperature)}°C</span>
            </div>
          )}

          {!token ? (
            <>
              <Link className="navbar-link" to="/login">
                Prijava
              </Link>
              <Link className="navbar-link" to="/register">
                Registracija
              </Link>
            </>
          ) : (
            <>
              {user?.username && <span className="navbar-user">{user.username}</span>}
              <button type="button" className="navbar-logout" onClick={handleLogout}>
                Odjava
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
