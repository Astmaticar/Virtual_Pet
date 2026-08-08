import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const PetContext = createContext(null);

export const PetProvider = ({ children }) => {
  const [pet, setPet] = useState(null);
  const [petExists, setPetExists] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchPet();
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
    <PetContext.Provider value={{ pet, petExists, loading, error, actionLoading, feed, clean, play, createPet, fetchPet }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => useContext(PetContext);
