import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import auth from '../services/auth';
import Toast from './Toast';

export default function Login({ onLogin }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [shake, setShake] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const navigate = useNavigate();

  function validateField(name) {
    const v = name === 'email' ? email : password;
    const result = {};
    if (name === 'email') {
      if (!v.trim()) result.email = 'Please enter your email address.';
      else {
        const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
        if (!ok) result.email = 'Please enter a valid email address.';
      }
    }
    if (name === 'password') {
      if (!v) result.password = 'Please enter your password.';
    }
    setErrors((s) => ({ ...s, ...result }));
    return Object.keys(result).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Basic empty-field validation
    if (!validateField('email') || !validateField('password')) {
      // focus and shake first invalid
      if (errors && errors.email) {
        setShake((s) => ({ ...s, email: true }));
        emailRef.current?.focus();
        setTimeout(() => setShake((s) => ({ ...s, email: false })), 650);
        setToast({ message: errors.email || 'Please complete required fields.', type: 'error' });
      } else if (errors && errors.password) {
        setShake((s) => ({ ...s, password: true }));
        passwordRef.current?.focus();
        setTimeout(() => setShake((s) => ({ ...s, password: false })), 650);
        setToast({ message: errors.password || 'Please complete required fields.', type: 'error' });
      }
      return;
    }

    setSubmitting(true);
    const res = auth.login(email.trim().toLowerCase(), password);
    setSubmitting(false);

    if (res.success) {
      onLogin(res.user);
      navigate('/account');
    } else {
      setError(res.message);
      setToast({ message: res.message, type: 'error' });
    }
  }

  const canSubmit = email.trim() !== '' && password !== '' && !submitting;

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Email <span className="required">*</span></label>
          <input ref={emailRef} value={email} onBlur={() => validateField('email')} onChange={(e) => { setEmail(e.target.value); setError(''); setErrors({ ...errors, email: null }); }} type="email" className={`${errors.email ? 'error-input' : ''} ${shake.email ? 'shake' : ''}`.trim()} required />
          {errors.email ? <div className="error">{errors.email}</div> : <div className="small">Enter the email you registered with.</div>}
        </div>

        <div className="form-group">
          <label>Password <span className="required">*</span></label>
          <input ref={passwordRef} value={password} onBlur={() => validateField('password')} onChange={(e) => { setPassword(e.target.value); setError(''); setErrors({ ...errors, password: null }); }} type="password" className={`${errors.password ? 'error-input' : ''} ${shake.password ? 'shake' : ''}`.trim()} required />
          {errors.password ? <div className="error">{errors.password}</div> : <div className="small">Enter your password.</div>}
        </div>

        {error && <div className="error">{error}</div>}

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={!canSubmit}>Login</button>
          <Link to="/register"><button className="secondary" type="button">Register</button></Link>
        </div>
      </form>
      <p className="small" style={{marginTop:12}}>Demo: data stored in your browser only.</p>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}