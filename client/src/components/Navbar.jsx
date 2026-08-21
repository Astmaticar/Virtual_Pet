import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { getWeatherLocation } from '../services/weatherLocation';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const location = await getWeatherLocation();
        const response = await api.get('/weather', { params: location || undefined });
        setWeather(response.data);
      } catch (err) {
        setWeather(null);
      }
    };

    fetchWeather();
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleMenuItemClick = () => setIsMenuOpen(false);

  const weatherDisplay = weather ? getWeatherIcon(weather.description, weather.temperature) : null;

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-shell">
        <Link className="navbar-brand" to="/" onClick={handleMenuItemClick}>
          <img src="/favicon.jpg" alt="Virtualni ljubimac" className="navbar-logo" />
          <span className="navbar-brand-name">Virtualni ljubimac</span>
        </Link>

        <button
          type="button"
          className="navbar-menu-toggle"
          aria-label={isMenuOpen ? 'Zatvori izbornik' : 'Otvori izbornik'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">☰</span>
        </button>

        <div className={`navbar-actions ${isMenuOpen ? 'is-open' : ''}`}>
          {weatherDisplay && (
            <div className="navbar-weather" title="Trenutno vrijeme">
              <span className="navbar-weather-icon">{weatherDisplay.icon}</span>
              <span className="navbar-weather-temp">{Math.round(weather.temperature)}°C</span>
            </div>
          )}

          {!token ? (
            <>
              <Link className="navbar-link" to="/login" onClick={handleMenuItemClick}>
                Prijava
              </Link>
              <Link className="navbar-link" to="/register" onClick={handleMenuItemClick}>
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
