import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Navbar from './components/Navbar';
import PublicRoute from './components/PublicRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <div className="sky-background" aria-hidden="true">
          <div className="sky-sun" />
          <div className="sky-cloud cloud-a" />
          <div className="sky-cloud cloud-b" />
          <div className="sky-cloud cloud-c" />
          <div className="sky-cloud cloud-d" />
          <div className="sky-ground-glow" />
        </div>

        <Navbar />

        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterForm /></PublicRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
