import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link className="navbar-brand" to="/">
        Virtualni ljubimac
      </Link>

      <div className="navbar-actions">
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
    </nav>
  );
};

export default Navbar;
