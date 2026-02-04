import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Account from './components/Account';
import ProtectedRoute from './components/ProtectedRoute';
import auth from './services/auth';

export default function App() {
  const [user, setUser] = React.useState(auth.getCurrentUser());
  const navigate = useNavigate();

  React.useEffect(() => {
    // listen to storage events (in case of multiple tabs)
    const onStorage = () => {
      setUser(auth.getCurrentUser());
    };
    window.addEventListener('storage', onStorage);

    // Add global click handler to animate button presses (adds .btn-press briefly)
    const onDocClick = (e) => {
      try {
        const btn = e.target.closest && e.target.closest('button');
        if (!btn) return;
        // ignore disabled buttons
        if (btn.disabled) return;
        btn.classList.add('btn-press');
        setTimeout(() => btn.classList.remove('btn-press'), 180);
      } catch (err) {
        // ignore
      }
    };

    document.addEventListener('click', onDocClick);

    return () => {
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('click', onDocClick);
    };
  }, []);

  function handleLogout() {
    auth.logout();
    setUser(null);
    navigate('/login');
  }

  return (
    <div className="container">
      <div className="topbar">
        <div>
          <strong>Account Manager</strong>
        </div>
        <div className="nav-links">
          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          {user && (
            <>
              <Link to="/account">My Account</Link>
              <button style={{marginLeft:10}} onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account onUserChange={(u) => setUser(u)} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={<Login onLogin={(u) => setUser(u)} />}
        />
        <Route
          path="/register"
          element={<Register onRegister={(u) => setUser(u)} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer className="app-footer">
        <p className="small">Note: This application is built for learning and experimentation. It is not production-ready and does not include full security, scalability, or deployment considerations.</p>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <p className="small">Use the links above to register, login, and manage your account.</p>
    </div>
  );
}

function NotFound() {
  return <h1>Page not found</h1>;
}