import React from 'react';
import userService from '../services/userService';
import auth from '../services/auth';

export default function Account({ onUserChange }) {
  const [user, setUser] = React.useState(auth.getCurrentUser());
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({ name: user.name, email: user.email });
  const [message, setMessage] = React.useState('');

  function startEdit() {
    setForm({ name: user.name, email: user.email });
    setEditing(true);
    setMessage('');
  }

  async function save() {
    setMessage('');
    if (!form.name.trim()) {
      setMessage('Name is required');
      return;
    }
    if (!form.email.trim()) {
      setMessage('Email is required');
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
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
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