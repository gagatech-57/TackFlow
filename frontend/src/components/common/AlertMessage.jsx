import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const AlertMessage = ({ type = 'error', message, errors = null }) => {
  if (!message && (!errors || errors.length === 0)) return null;

  const isError = type === 'error';

  return (
    <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
      {isError ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
      <div style={{ flex: 1 }}>
        {message && <div>{message}</div>}
        {errors && errors.length > 0 && (
          <ul style={{ marginTop: '0.25rem', paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
            {errors.map((err, idx) => (
              <li key={idx}>{err.message || err.msg || err}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlertMessage;
