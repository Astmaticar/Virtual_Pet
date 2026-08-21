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
  const [petIsDead, setPetIsDead] = useState(false);
  const [petExists, setPetExists] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherCondition, setWeatherCondition] = useState(null);
  const [isDay, setIsDay] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [evolutionInfo, setEvolutionInfo] = useState(null);

  const fetchPet = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/pet');
      setPet(response.data);
      setPetIsDead(Boolean(response.data.isDead));
      setPetExists(true);
    } catch (err) {
      const missingPet = err.response?.status === 404 || err.response?.data?.message?.toLowerCase().includes('pet not found');

      setPet(null);
      setPetIsDead(false);
      setPetExists(!missingPet ? false : false);

      if (!missingPet) {
        setError(err.response?.data?.message || 'Ne mogu dohvatiti ljubimca.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Tiho ažuriranje - bez loading state-a, koristi se za polling
  const pollPet = async () => {
    try {
      const response = await api.get('/pet');
      setPet(response.data);
      setPetIsDead(Boolean(response.data.isDead));
      setPetExists(true);
      // Ne postavljamo error jer je polling u pozadini
    } catch (err) {
      const missingPet = err.response?.status === 404 || err.response?.data?.message?.toLowerCase().includes('pet not found');
      if (missingPet) {
        setPet(null);
        setPetIsDead(false);
        setPetExists(false);
      }
      // Ne postavljamo error za polling - tiho ispod
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
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
    fetchWeather();
  }, []);

  // Polling - poziva pollPet svakih 30 sekundi (bez white screena)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      pollPet();
    }, 30000); // 30 sekundi

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  const createPet = async (name, species, variant, gender) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await api.post('/pet', { name, species, variant, gender });
      setPet(response.data);
      setPetIsDead(false);
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
      setPetIsDead(Boolean(response.data.isDead));

      // Provjera je li došlo do evolucije
      if (response.data.hasEvolved && response.data.newStage) {
        setEvolutionInfo({
          newStage: response.data.newStage,
          species: response.data.species,
        });

        // Automatski zatvori overlay nakon 3 sekunde
        setTimeout(() => {
          setEvolutionInfo(null);
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Greška pri akciji.');
    } finally {
      setActionLoading(false);
    }
  };

  const feed = () => runAction('feed');
  const clean = () => runAction('clean');
  const play = () => runAction('play');

  const deletePet = async () => {
    setActionLoading(true);
    setError(null);

    try {
      await api.delete('/pet');
      setPet(null);
      setPetIsDead(false);
      setPetExists(false);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Ne mogu obrisati ljubimca.';
      setError(message);
      return { success: false, message };
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PetContext.Provider value={{
      pet,
      petIsDead,
      petExists,
      loading,
      error,
      actionLoading,
      weather,
      weatherCondition,
      isDay,
      weatherLoading,
      weatherError,
      evolutionInfo,
      setEvolutionInfo,
      feed,
      clean,
      play,
      deletePet,
      createPet,
      fetchPet,
      fetchWeather,
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => useContext(PetContext);
