import React from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  React.useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onClose && onClose(), 3000);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${type}`} role="alert" aria-live="assertive">
      <div className="toast-body">{message}</div>
      <button className="toast-close" onClick={() => onClose && onClose()} aria-label="Close">×</button>
    </div>
  );
}
