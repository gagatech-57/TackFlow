import React from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, Search, Plus } from 'lucide-react';

const EmptyState = ({
  type = 'projects',
  title,
  description,
  actionText,
  onAction
}) => {
  const defaults = {
    projects: {
      title: "No projects are moving yet.",
      description: "Ignite your kinetic workspace by creating your first project stream.",
      icon: Layers,
      actionText: "Create First Project"
    },
    tasks: {
      title: "No task streams active.",
      description: "Add a task node to track progress along your project timeline.",
      icon: CheckCircle2,
      actionText: "Add New Task"
    },
    search: {
      title: "No matching workflow nodes found.",
      description: "Try adjusting your query or resetting status filter criteria.",
      icon: Search,
      actionText: null
    }
  };

  const current = defaults[type] || defaults.projects;
  const displayTitle = title || current.title;
  const displayDesc = description || current.description;
  const displayAction = actionText || current.actionText;
  const IconComponent = current.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2563eb',
          marginBottom: '1.25rem'
        }}
      >
        <IconComponent size={28} />
      </motion.div>

      <h3 style={{
        fontSize: '1.125rem',
        fontWeight: 700,
        color: 'var(--text-main)',
        marginBottom: '0.375rem'
      }}>
        {displayTitle}
      </h3>

      <p style={{
        fontSize: '0.875rem',
        color: 'var(--text-secondary)',
        maxWidth: '380px',
        marginBottom: displayAction && onAction ? '1.5rem' : '0'
      }}>
        {displayDesc}
      </p>

      {displayAction && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
          style={{ gap: '0.5rem' }}
        >
          <Plus size={16} />
          {displayAction}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
