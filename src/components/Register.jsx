import React from 'react';
import { useNavigate } from 'react-router-dom';
import auth from '../services/auth';
import Toast from './Toast';

export default function Register({ onRegister }) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [shake, setShake] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const confirmRef = React.useRef(null);
  const navigate = useNavigate();

  function validateField(name) {
    const v = { name, email, password, confirm }[name] || '';
    const result = {};

    if (name === 'name') {
      if (!v.trim()) result.name = 'Please enter your full name.';
    }

    if (name === 'email') {
      if (!v.trim()) result.email = 'Please enter your email address.';
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim())) result.email = 'Please enter a valid email address.';
    }

    if (name === 'password') {
      if (!v) result.password = 'Please enter a password.';
      else if (v.length < 6) result.password = 'Password must be at least 6 characters.';
    }

    if (name === 'confirm') {
      if (!v) result.confirm = 'Please confirm your password.';
      else if (v !== password) result.confirm = 'Passwords do not match.';
    }

    setErrors((s) => ({ ...s, ...result }));
    return Object.keys(result).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // run validations
    const order = ['name','email','password','confirm'];
    for (const key of order) {
      if (!validateField(key)) {
        // focus and shake
        const refMap = { name: nameRef, email: emailRef, password: passwordRef, confirm: confirmRef };
        setShake((s) => ({ ...s, [key]: true }));
        refMap[key].current?.focus();
        setTimeout(() => setShake((s) => ({ ...s, [key]: false })), 650);
        setToast({ message: Object.values(errors)[0] || 'Please complete required fields.', type: 'error' });
        return;
      }
    }

    setSubmitting(true);
    const res = auth.register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    });
    setSubmitting(false);

    if (res.success) {
      onRegister(res.user);
      setToast({ message: 'Account created', type: 'success' });
      navigate('/account');
    } else {
      setError(res.message);
      setToast({ message: res.message, type: 'error' });
    }
  }

  const canSubmit = name.trim() !== '' && email.trim() !== '' && password.length >= 6 && password === confirm && !submitting;

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Full name <span className="required">*</span></label>
          <input ref={nameRef} value={name} onBlur={() => validateField('name')} onChange={(e) => { setName(e.target.value); setError(''); setErrors({ ...errors, name: null }); }} type="text" className={`${errors.name ? 'error-input' : ''} ${shake.name ? 'shake' : ''}`.trim()} required />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label>Email <span className="required">*</span></label>
          <input ref={emailRef} value={email} onBlur={() => validateField('email')} onChange={(e) => { setEmail(e.target.value); setError(''); setErrors({ ...errors, email: null }); }} type="email" className={`${errors.email ? 'error-input' : ''} ${shake.email ? 'shake' : ''}`.trim()} required />
          {errors.email ? <div className="error">{errors.email}</div> : <div className="small">We'll never share your email.</div>}
        </div>

        <div className="form-group">
          <label>Password <span className="required">*</span></label>
          <input ref={passwordRef} value={password} onBlur={() => validateField('password')} onChange={(e) => { setPassword(e.target.value); setError(''); setErrors({ ...errors, password: null }); }} type="password" className={`${errors.password ? 'error-input' : ''} ${shake.password ? 'shake' : ''}`.trim()} required />
          {errors.password ? <div className="error">{errors.password}</div> : <div className="small">Use at least 6 characters.</div>}
        </div>

        <div className="form-group">
          <label>Confirm password <span className="required">*</span></label>
          <input ref={confirmRef} value={confirm} onBlur={() => validateField('confirm')} onChange={(e) => { setConfirm(e.target.value); setError(''); setErrors({ ...errors, confirm: null }); }} type="password" className={`${errors.confirm ? 'error-input' : ''} ${shake.confirm ? 'shake' : ''}`.trim()} required />
          {errors.confirm ? <div className="error">{errors.confirm}</div> : <div className="small">Must match the password above.</div>}
        </div>

        {error && <div className="error">{error}</div>}

        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={!canSubmit}>Create account</button>
        </div>
      </form>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}