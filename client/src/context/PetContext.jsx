import { createContext, useContext, useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { getWeatherLocation } from '../services/weatherLocation';

const PetContext = createContext(null);

const buildLocalWeatherFallback = () => {
  const hour = new Date().getHours();
  const isDayFallback = hour >= 6 && hour < 20;

  return {
    city: 'Osijek',
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
  const [weatherOverride, setWeatherOverride] = useState(null);
  const [dayOverride, setDayOverride] = useState(null);
  const [evolutionInfo, setEvolutionInfo] = useState(null);
  const [actionEffect, setActionEffect] = useState(null);
  const actionEffectTimeoutRef = useRef(null);

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

  const pollPet = async () => {
    try {
      const response = await api.get('/pet');
      setPet(response.data);
      setPetIsDead(Boolean(response.data.isDead));
      setPetExists(true);
    } catch (err) {
      const missingPet = err.response?.status === 404 || err.response?.data?.message?.toLowerCase().includes('pet not found');
      if (missingPet) {
        setPet(null);
        setPetIsDead(false);
        setPetExists(false);
      }
    }
  };

  const fetchWeather = async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    setWeatherOverride(null);
    setDayOverride(null);

    try {
      const location = await getWeatherLocation();
      const response = await api.get('/weather', { params: location || undefined });
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

  const setWeatherPreset = (condition, isDayValue) => {
    setWeatherOverride(condition);
    setDayOverride(Boolean(isDayValue));
  };

  const resetWeatherPreset = () => {
    setWeatherOverride(null);
    setDayOverride(null);
  };

  const addExperience = async (amount) => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await api.put('/pet/xp', { amount });
      setPet(response.data);
      setPetIsDead(Boolean(response.data.isDead));

      if (response.data.hasEvolved && response.data.newStage) {
        setEvolutionInfo({
          newStage: response.data.newStage,
          species: response.data.species,
        });

        setTimeout(() => {
          setEvolutionInfo(null);
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ne mogu dodati iskustvene bodove.');
    } finally {
      setActionLoading(false);
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
    }, 30000);

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
      const oldPet = pet;
      const response = await api.put(`/pet/${action}`);
      setPet(response.data);
      setPetIsDead(Boolean(response.data.isDead));
      
      const actionStatMap = {
        feed: 'hunger',
        clean: 'cleanliness',
        play: 'happiness',
      };

      const targetStat = actionStatMap[action];
      const previousTargetValue = oldPet?.[targetStat];
      const newTargetValue = response.data?.[targetStat];
      const previousEnergy = oldPet?.energy;
      const hasEnoughEnergy = action !== 'play' || (typeof previousEnergy === 'number' ? previousEnergy > 0 : true);

      const statImproved = Boolean(
        targetStat &&
        typeof previousTargetValue === 'number' &&
        typeof newTargetValue === 'number' &&
        newTargetValue > previousTargetValue
      );

      const actionAllowed = Boolean(
        action &&
        hasEnoughEnergy &&
        (!targetStat || typeof previousTargetValue === 'number')
      );

      // Prikaži efekt kada je akcija bila dopuštena i uspješno provedena.
      // Za play, efekt se prikazuje i kada je happiness već na 100, jer se i dalje troši energija.
      const shouldShowEffect = Boolean(
        actionAllowed &&
        response.data &&
        !response.data.isDead &&
        (action === 'play' || statImproved)
      );

      if (shouldShowEffect) {
        if (actionEffectTimeoutRef.current) {
          clearTimeout(actionEffectTimeoutRef.current);
        }

        setActionEffect(null);
        actionEffectTimeoutRef.current = setTimeout(() => {
          setActionEffect(action);
          actionEffectTimeoutRef.current = setTimeout(() => setActionEffect(null), 1500);
        }, 0);
      }

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
      weatherOverride,
      dayOverride,
      weatherLoading,
      weatherError,
      evolutionInfo,
      setEvolutionInfo,
      actionEffect,
      setActionEffect,
      setWeatherPreset,
      resetWeatherPreset,
      addExperience,
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
