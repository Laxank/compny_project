import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import auth from '../services/auth';

export default function Login({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const res = auth.login(email.trim().toLowerCase(), password);
    if (res.success) {
      onLogin(res.user);
      navigate('/account');
    } else {
      setError(res.message);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>

        {error && <div className="error">{error}</div>}

        <div style={{ marginTop: 12 }}>
          <button type="submit">Login</button>
          <Link to="/register"><button className="secondary" type="button">Register</button></Link>
        </div>
      </form>
      <p className="small" style={{marginTop:12}}>Demo: data stored in your browser only.</p>
    </div>
  );
}