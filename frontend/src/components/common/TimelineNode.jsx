import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Circle, ArrowRight } from 'lucide-react';

const TimelineNode = ({ tasks = [], onTaskClick, activeTaskId }) => {
  // Sort tasks chronologically in 1st, 2nd, 3rd creation order
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return (a.id || 0) - (b.id || 0);
  });

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-sm)',
      overflowX: 'auto'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Kinetic Project Timeline
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Workflow stream from initiation to completion
          </p>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '0.25rem 0.625rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--bg-subtle)',
          color: 'var(--text-secondary)'
        }}>
          {sortedTasks.filter(t => t.status === 'Completed').length} / {sortedTasks.length} Nodes Complete
        </span>
      </div>

      {sortedTasks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          color: 'var(--text-muted)',
          fontSize: '0.875rem'
        }}>
          No task nodes in timeline yet. Create a task to ignite the workflow stream!
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          minWidth: 'max-content',
          padding: '1rem 0.5rem'
        }}>
          {/* START Node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              border: '2px solid #2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563eb',
              fontWeight: 800,
              fontSize: '0.75rem'
            }}>
              IN
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>START</span>
          </div>

          {/* Connector Line to first task */}
          <div style={{
            width: '40px',
            height: '3px',
            backgroundColor: sortedTasks[0]?.status === 'Completed' ? '#10b981' : '#2563eb',
            position: 'relative'
          }} />

          {/* Task Nodes Stream */}
          {sortedTasks.map((task, idx) => {
            const isCompleted = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';
            const isActive = activeTaskId === task.id;
            const nextCompleted = sortedTasks[idx + 1]?.status === 'Completed';

            return (
              <React.Fragment key={task.id || idx}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  onClick={() => onTaskClick && onTaskClick(task)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#ecfdf5' : isInProgress ? '#eff6ff' : '#ffffff',
                    border: `2.5px solid ${isCompleted ? '#10b981' : isInProgress ? '#2563eb' : '#cbd5e1'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCompleted ? '#10b981' : isInProgress ? '#2563eb' : '#64748b',
                    boxShadow: isActive ? '0 0 0 4px rgba(37, 99, 235, 0.2)' : isCompleted ? '0 2px 6px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'var(--transition-fast)'
                  }}>
                    {isCompleted ? (
                      <CheckCircle2 size={20} />
                    ) : isInProgress ? (
                      <Clock size={18} className="animate-pulse-node" />
                    ) : (
                      <Circle size={16} />
                    )}
                  </div>

                  <div style={{
                    textAlign: 'center',
                    maxWidth: '100px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    <div style={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: isCompleted ? '#047857' : 'var(--text-main)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {task.name}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      fontWeight: 500,
                      color: task.priority === 'High' ? '#dc2626' : task.priority === 'Medium' ? '#d97706' : '#16a34a'
                    }}>
                      {task.priority}
                    </div>
                  </div>
                </motion.div>

                {/* Connector Line between nodes */}
                {idx < sortedTasks.length - 1 && (
                  <div style={{
                    width: '44px',
                    height: '3px',
                    backgroundColor: nextCompleted ? '#10b981' : isCompleted ? '#2563eb' : '#e2e8f0',
                    transition: 'var(--transition-normal)'
                  }} />
                )}
              </React.Fragment>
            );
          })}

          {/* Connector Line to END */}
          <div style={{
            width: '40px',
            height: '3px',
            backgroundColor: sortedTasks.every(t => t.status === 'Completed') && sortedTasks.length > 0 ? '#10b981' : '#e2e8f0'
          }} />

          {/* END Node */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: sortedTasks.every(t => t.status === 'Completed') && sortedTasks.length > 0 ? '#ecfdf5' : '#f8fafc',
              border: `2px solid ${sortedTasks.every(t => t.status === 'Completed') && sortedTasks.length > 0 ? '#10b981' : '#cbd5e1'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: sortedTasks.every(t => t.status === 'Completed') && sortedTasks.length > 0 ? '#10b981' : '#94a3b8',
              fontWeight: 800,
              fontSize: '0.75rem'
            }}>
              OUT
            </div>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: sortedTasks.every(t => t.status === 'Completed') && sortedTasks.length > 0 ? '#10b981' : '#94a3b8'
            }}>
              END
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineNode;
