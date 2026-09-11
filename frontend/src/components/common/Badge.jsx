import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    'Completed': { bg: 'var(--status-completed-bg)', text: 'var(--status-completed-text)', border: 'var(--status-completed-border)', dot: '#059669' },
    'In Progress': { bg: 'var(--status-progress-bg)', text: 'var(--status-progress-text)', border: 'var(--status-progress-border)', dot: '#2563eb' },
    'Pending': { bg: 'var(--status-pending-bg)', text: 'var(--status-pending-text)', border: 'var(--status-pending-border)', dot: '#d97706' },
    'Not Started': { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', dot: '#64748b' }
  };

  const current = styles[status] || styles['Not Started'];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.25rem 0.625rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      borderRadius: 'var(--radius-full)',
      backgroundColor: current.bg,
      color: current.text,
      border: `1px solid ${current.border}`,
      whiteSpace: 'nowrap'
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: current.dot
      }} />
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const styles = {
    'High': { bg: 'var(--priority-high-bg)', text: 'var(--priority-high-text)', border: '#fca5a5' },
    'Medium': { bg: 'var(--priority-medium-bg)', text: 'var(--priority-medium-text)', border: '#fde68a' },
    'Low': { bg: 'var(--priority-low-bg)', text: 'var(--priority-low-text)', border: '#86efac' }
  };

  const current = styles[priority] || styles['Low'];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.2rem 0.5rem',
      fontSize: '0.725rem',
      fontWeight: 600,
      borderRadius: 'var(--radius-sm)',
      backgroundColor: current.bg,
      color: current.text,
      border: `1px solid ${current.border}`,
      whiteSpace: 'nowrap'
    }}>
      {priority}
    </span>
  );
};

export default StatusBadge;
