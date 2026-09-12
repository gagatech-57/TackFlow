import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, CheckCircle2, Clock, Circle, Calendar, Edit, Trash2, X } from 'lucide-react';
import { taskService } from '../services/taskService';
import StatusBadge, { PriorityBadge } from '../components/common/Badge';
import KineticLoader from '../components/common/KineticLoader';
import EmptyState from '../components/common/EmptyState';
import TaskFormModal from './TaskFormModal';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';

import CustomSelect from '../components/common/CustomSelect';
import { pageCache } from '../utils/cache';

const Tasks = () => {
  const [tasks, setTasks] = useState(pageCache.tasks || []);
  const [loading, setLoading] = useState(!pageCache.tasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    if (pageCache.tasks) {
      loadTasks(true);
    } else {
      loadTasks(false);
    }
  }, []);

  const loadTasks = async (isSilent = false) => {
    if (!isSilent && !pageCache.tasks) setLoading(true);
    try {
      const res = await taskService.getTasks();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setTasks(list);
      pageCache.tasks = list;
    } catch (err) {
      console.error('Failed to load tasks', err);
      if (!isSilent) showToast('Failed to load task stream', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSaved = (savedTask) => {
    if (savedTask && savedTask.id) {
      setTasks((prev) => {
        const exists = prev.some(t => t.id === savedTask.id);
        const updated = exists
          ? prev.map(t => t.id === savedTask.id ? { ...t, ...savedTask } : t)
          : [savedTask, ...prev];
        pageCache.tasks = updated;
        return updated;
      });
    }
    loadTasks(true);
  };

  const handleCreateNew = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const confirmDelete = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      const res = await taskService.deleteTask(taskToDelete.id);
      const isSuccess = res && (res.success || res.status === 200);
      if (isSuccess) {
        showToast('Task node removed', 'info');
        setTasks(tasks.filter(t => t.id !== taskToDelete.id));
        setDeleteModalOpen(false);
      }
    } catch (err) {
      showToast('Failed to delete task node', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleComplete = async (task) => {
    const isCompleted = task.status === 'Completed';
    const nextStatus = isCompleted ? 'Pending' : 'Completed';

    try {
      const res = await taskService.updateTask(task.id, { status: nextStatus });
      const isSuccess = res && (res.success || res.status === 200);
      if (isSuccess) {
        showToast(nextStatus === 'Completed' ? 'Task node resolved! Workflow advanced.' : 'Task returned to pending', 'success');
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: nextStatus } : t));
      }
    } catch (err) {
      showToast('Failed to change task status', 'error');
    }
  };

  // Filter & Search Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const streamColumns = [
    { title: 'PENDING STREAMS', status: 'Pending', icon: Circle, color: '#d97706', bg: '#fffbeb' },
    { title: 'IN PROGRESS', status: 'In Progress', icon: Clock, color: '#2563eb', bg: '#eff6ff' },
    { title: 'COMPLETED', status: 'Completed', icon: CheckCircle2, color: '#059669', bg: '#ecfdf5' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', wordBreak: 'break-word' }}>
              Task Stream Board
            </h1>
            <span style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              padding: '0.2rem 0.625rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--secondary-light)',
              color: 'var(--secondary)',
              whiteSpace: 'nowrap'
            }}>
              {tasks.length} Nodes
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
            Interactive workflow pipeline for node state tracking and execution.
          </p>
        </div>

        <button onClick={handleCreateNew} className="btn btn-primary w-full sm:w-auto" style={{ gap: '0.5rem', fontWeight: 700 }}>
          <Plus size={18} />
          <span>Insert Task Node</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm w-full min-w-0">
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, width: '100%', minWidth: 0 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search task nodes by name or criteria..."
            className="form-input w-full"
            style={{ paddingLeft: '2.5rem', paddingRight: searchQuery ? '2rem' : '0.875rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Controls Wrapper */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto min-w-0">
          {/* Isolated Status Filter Chips Horizontal Scroll Container */}
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-1 sm:pb-0 max-w-full min-w-0">
            {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '0.4rem 0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: statusFilter === status ? 700 : 500,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: statusFilter === status ? 'var(--primary)' : 'var(--border-subtle)',
                  backgroundColor: statusFilter === status ? 'var(--primary-light)' : 'transparent',
                  color: statusFilter === status ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Priority Filter Select */}
          <div className="w-full sm:w-48 min-w-0">
            <CustomSelect
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: 'All', label: 'All Priorities' },
                { value: 'High', label: 'High Priority' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'Low', label: 'Low Priority' }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Task Streams Workflow Board */}
      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <KineticLoader size="large" text="Syncing Task Stream..." />
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          type={searchQuery || statusFilter !== 'All' ? 'search' : 'tasks'}
          onAction={searchQuery || statusFilter !== 'All' ? null : handleCreateNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start w-full min-w-0">
          {streamColumns.map((col) => {
            const columnTasks = filteredTasks.filter(t => t.status === col.status);
            const Icon = col.icon;

            return (
              <div
                key={col.status}
                className="kinetic-card w-full min-w-0"
                style={{ padding: '1.25rem' }}
              >
                {/* Stream Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      backgroundColor: col.bg,
                      color: col.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                      {col.title}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: col.bg,
                    color: col.color
                  }}>
                    {columnTasks.length}
                  </span>
                </div>

                {/* Task Cards Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', minHeight: '120px' }}>
                  {columnTasks.length === 0 ? (
                    <div style={{ padding: '1.5rem 0.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      No tasks in {col.status.toLowerCase()} stream
                    </div>
                  ) : (
                    <AnimatePresence>
                      {columnTasks.map((task) => {
                        const isCompleted = task.status === 'Completed';

                        return (
                          <motion.div
                            key={task.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -2 }}
                            className="w-full min-w-0"
                            style={{
                              padding: '1rem',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: 'var(--bg-surface)',
                              border: `1px solid ${isCompleted ? '#a7f3d0' : 'var(--border-subtle)'}`,
                              boxShadow: 'var(--shadow-sm)',
                              transition: 'var(--transition-kinetic)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.625rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                              {/* Task Checkbox & Title */}
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', flex: 1, minWidth: 0 }}>
                                <button
                                  onClick={() => handleToggleComplete(task)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: isCompleted ? '#10b981' : '#cbd5e1',
                                    padding: 0,
                                    marginTop: '2px',
                                    display: 'flex'
                                  }}
                                  aria-label="Mark task completed"
                                >
                                  <CheckCircle2 size={18} style={{ fill: isCompleted ? '#ecfdf5' : 'transparent' }} />
                                </button>

                                <span style={{
                                  fontSize: '0.9rem',
                                  fontWeight: 600,
                                  color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                                  textDecoration: isCompleted ? 'line-through' : 'none',
                                  lineHeight: 1.35,
                                  wordBreak: 'break-word'
                                }}>
                                  {task.name}
                                </span>
                              </div>

                              <PriorityBadge priority={task.priority} />
                            </div>

                            {task.description && (
                              <p style={{
                                fontSize: '0.8125rem',
                                color: 'var(--text-secondary)',
                                marginBottom: '0.875rem',
                                paddingLeft: '1.75rem',
                                display: '-webkit-box',
                                lineClamp: 2,
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                wordBreak: 'break-word'
                              }}>
                                {task.description}
                              </p>
                            )}

                            {/* Card Footer */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '0.5rem',
                              paddingTop: '0.625rem',
                              borderTop: '1px solid var(--border-subtle)',
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)'
                            }}>
                              <span style={{ fontWeight: 600, color: 'var(--primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
                                {task.project?.name || 'Project Stream'}
                              </span>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
                                <button
                                  onClick={() => handleEdit(task)}
                                  className="btn btn-ghost"
                                  style={{ padding: '3px', borderRadius: '4px' }}
                                  aria-label="Edit task"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => confirmDelete(task)}
                                  className="btn btn-ghost"
                                  style={{ padding: '3px', borderRadius: '4px', color: '#ef4444' }}
                                  aria-label="Delete task"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={editingTask}
        onTaskSaved={handleTaskSaved}
      />

      {/* Task Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Task Node?"
        maxWidth="440px"
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Are you sure you want to delete task <strong>"{taskToDelete?.name}"</strong>?
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={() => setDeleteModalOpen(false)} className="btn btn-secondary" disabled={deleting}>
            Cancel
          </button>
          <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
            {deleting ? <KineticLoader color="white" text="Deleting..." /> : 'Delete Node'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Tasks;
