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
    return () => window.removeEventListener('storage', onStorage);
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