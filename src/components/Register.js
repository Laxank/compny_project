import React from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../services/auth';

export default function Register({ onRegister }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Name is required');
    if (!email.trim()) return setError('Email is required');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (password !== confirm) return setError('Passwords do not match');

    const res = auth.register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    });

    if (res.success) {
      onRegister(res.user);
      navigate('/account');
    } else {
      setError(res.message);
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </div>

        <div className="form-group">
          <label>Confirm password</label>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" />
        </div>

        {error && <div className="error">{error}</div>}

        <div style={{ marginTop: 12 }}>
          <button type="submit">Create account</button>
        </div>
      </form>
    </div>
  );
}