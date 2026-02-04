import React from 'react';
import userService from '../services/userService';
import auth from '../services/auth';

export default function Account({ onUserChange }) {
  const [user, setUser] = React.useState(auth.getCurrentUser());
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({ name: user.name, email: user.email });
  const [message, setMessage] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [shake, setShake] = React.useState({});
  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);

  function startEdit() {
    setForm({ name: user.name, email: user.email });
    setEditing(true);
    setMessage('');
    setErrors({});
  }

  function validateField(name) {
    const v = form[name] || '';
    const result = {};
    if (name === 'name') {
      if (!v.trim()) result.name = 'Please enter your name.';
    }
    if (name === 'email') {
      if (!v.trim()) result.email = 'Please enter your email address.';
      else {
        const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
        if (!emailOk) result.email = 'Please enter a valid email address.';
      }
    }
    setErrors((s) => ({ ...s, ...result }));
    return Object.keys(result).length === 0;
  }

  async function save() {
    setMessage('');
    setErrors({});

    // Field-level validation
    if (!validateField('name')) {
      setShake((s) => ({ ...s, name: true }));
      nameRef.current?.focus();
      setTimeout(() => setShake((s) => ({ ...s, name: false })), 650);
      return;
    }

    if (!validateField('email')) {
      setShake((s) => ({ ...s, email: true }));
      emailRef.current?.focus();
      setTimeout(() => setShake((s) => ({ ...s, email: false })), 650);
      return;
    }

    const res = userService.updateUser(user.id, { name: form.name.trim(), email: form.email.trim().toLowerCase() });
    if (res.success) {
      setUser(res.user);
      auth.setSessionUser(res.user); // update session
      onUserChange(res.user);
      setEditing(false);
      setMessage('Saved');
      setTimeout(() => setMessage(''), 1800);
    } else {
      setMessage(res.message);
    }
  }

  function cancel() {
    setEditing(false);
    setMessage('');
    setErrors({});
  }

  return (
    <div>
      <h1>My Account</h1>

      {!editing && (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p className="small">Member since: {new Date(user.createdAt).toLocaleString()}</p>
          <div style={{ marginTop: 12 }}>
            <button onClick={startEdit}>Edit</button>
          </div>
          {message && <div style={{marginTop:12}} className="small">{message}</div>}
        </div>
      )}

      {editing && (
        <div>
          <div className="form-group">
            <label htmlFor="acct-name">Name</label>
            <input id="acct-name" ref={nameRef} aria-invalid={!!errors.name} className={`${errors.name ? 'error-input' : ''} ${shake.name ? 'shake' : ''}`.trim()} value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: null }); }} type="text" />
            {errors.name ? <div className="error">{errors.name}</div> : <div className="small">Enter your display name.</div>}
          </div>

          <div className="form-group">
            <label htmlFor="acct-email">Email <span className="required">*</span></label>
            <input id="acct-email" ref={emailRef} aria-required="true" aria-invalid={!!errors.email} className={`${errors.email ? 'error-input' : ''} ${shake.email ? 'shake' : ''}`.trim()} value={form.email} onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: null }); }} onBlur={() => validateField('email')} type="email" />
            {errors.email ? <div className="error">{errors.email}</div> : <div className="small">We'll only use this for account purposes.</div> }
          </div>

          {message && <div className="error">{message}</div>}

          <div style={{ marginTop: 12 }}>
            <button onClick={save}>Save</button>
            <button className="secondary" onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}