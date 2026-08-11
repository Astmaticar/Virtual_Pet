import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const PetContext = createContext(null);

const buildLocalWeatherFallback = () => {
  const hour = new Date().getHours();
  const isDayFallback = hour >= 6 && hour < 20;

  return {
    city: 'Zagreb',
    temperature: isDayFallback ? 23 : 16,
    description: isDayFallback ? 'clear sky' : 'few clouds',
    condition: isDayFallback ? 'Clear' : 'Clouds',
    isDay: isDayFallback,
  };
};

export const PetProvider = ({ children }) => {
  const [pet, setPet] = useState(null);
  const [petExists, setPetExists] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [isDay, setIsDay] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  const fetchPet = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/pet');
      setPet(response.data);
      setPetExists(true);
    } catch (err) {
      const missingPet = err.response?.status === 404 || err.response?.data?.message?.toLowerCase().includes('pet not found');

      setPet(null);
      setPetExists(!missingPet ? false : false);

      if (!missingPet) {
        setError(err.response?.data?.message || 'Ne mogu dohvatiti ljubimca.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      const response = await api.get('/weather');
      const weatherData = response.data;

      setWeather(weatherData);
      setWeatherCondition(weatherData.condition || null);
      setIsDay(Boolean(weatherData.isDay));
    } catch (err) {
      const fallbackWeather = buildLocalWeatherFallback();

      setWeather(fallbackWeather);
      setWeatherCondition(fallbackWeather.condition);
      setIsDay(fallbackWeather.isDay);
      setWeatherError(null);
      console.warn('Weather API unavailable, using local fallback.', err);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
    fetchWeather();
  }, []);

  const createPet = async (name) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await api.post('/pet', { name });
      setPet(response.data);
      setPetExists(true);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Ne mogu stvoriti ljubimca.';
      setError(message);
      return { success: false, message };
    } finally {
      setActionLoading(false);
    }
  };

  const runAction = async (action) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await api.put(`/pet/${action}`);
      setPet(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri akciji.');
    } finally {
      setActionLoading(false);
    }
  };

  const feed = () => runAction('feed');
  const clean = () => runAction('clean');
  const play = () => runAction('play');

  return (
    <PetContext.Provider value={{
      pet,
      petExists,
      loading,
      error,
      actionLoading,
      weather,
      weatherCondition,
      isDay,
      weatherLoading,
      weatherError,
      feed,
      clean,
      play,
      createPet,
      fetchPet,
      fetchWeather,
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => useContext(PetContext);
