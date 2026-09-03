import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import './AuthForm.css';

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (password !== confirmPassword) {
      setFormError('Lozinke se ne podudaraju.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post(`/auth/reset-password/${token}`, { password });
      navigate('/login', { state: { message: response.data.message } });
    } catch (error) {
      setFormError(error.response?.data?.message || 'Ne mogu promijeniti lozinku.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Nova lozinka</h2>
        {formError && <div className="auth-error">{formError}</div>}
        <label>
          Nova lozinka
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength="6"
            required
          />
        </label>
        <label>
          Potvrdi lozinku
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength="6"
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Spremanje...' : 'Promijeni lozinku'}
        </button>
        <p>
          <Link to="/login">Natrag na prijavu</Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
