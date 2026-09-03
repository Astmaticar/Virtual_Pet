import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './AuthForm.css';

const COOLDOWN_STORAGE_KEY = 'forgot-password-cooldown-until';

const getStoredCooldownSeconds = () => {
  const cooldownUntil = Number(localStorage.getItem(COOLDOWN_STORAGE_KEY));
  return cooldownUntil ? Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000)) : 0;
};

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(getStoredCooldownSeconds);

  useEffect(() => {
    const updateCooldown = () => {
      const cooldownUntil = Number(localStorage.getItem(COOLDOWN_STORAGE_KEY));
      const remainingSeconds = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownSeconds(remainingSeconds);
      if (remainingSeconds === 0) {
        localStorage.removeItem(COOLDOWN_STORAGE_KEY);
      }
    };

    updateCooldown();
    const timer = setInterval(updateCooldown, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    setFormError(null);

    if (cooldownSeconds > 0) return;

    setSubmitting(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      localStorage.setItem(COOLDOWN_STORAGE_KEY, String(Date.now() + 60 * 1000));
      setCooldownSeconds(60);
    } catch (error) {
      setFormError(error.response?.data?.message || 'Ne mogu poslati zahtjev za reset lozinke.');
      if (error.response?.status === 429) {
        setCooldownSeconds(error.response.data.retryAfterSeconds || 60);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Zaboravljena lozinka</h2>
        {message && <div className="auth-success">{message}</div>}
        {formError && <div className="auth-error">{formError}</div>}
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <button type="submit" disabled={submitting || cooldownSeconds > 0}>
          {submitting
            ? 'Slanje...'
            : cooldownSeconds > 0
              ? `Pošalji ponovno za ${cooldownSeconds}s`
              : 'Pošalji link za reset'}
        </button>
        <p>
          <Link to="/login">Natrag na prijavu</Link>
        </p>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
