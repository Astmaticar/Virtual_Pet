import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const PetContext = createContext(null);

export const PetProvider = ({ children }) => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPet = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/pet');
      setPet(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Ne mogu dohvatiti ljubimca.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
  }, []);

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
    <PetContext.Provider value={{ pet, loading, error, actionLoading, feed, clean, play, fetchPet }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => useContext(PetContext);
