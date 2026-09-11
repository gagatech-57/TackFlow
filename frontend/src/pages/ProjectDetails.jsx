import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Calendar, Edit, Trash2, CheckCircle2, Clock, Circle, Filter } from 'lucide-react';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import StatusBadge, { PriorityBadge } from '../components/common/Badge';
import KineticLoader from '../components/common/KineticLoader';
import TimelineNode from '../components/common/TimelineNode';
import TaskFormModal from './TaskFormModal';
import ProjectFormModal from './ProjectFormModal';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [activeTimelineTaskId, setActiveTimelineTaskId] = useState(null);

  const [deleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deletingTask, setDeletingTask] = useState(false);

  useEffect(() => {
    loadProjectAndTasks();
  }, [id]);

  const loadProjectAndTasks = async () => {
    setLoading(true);
    try {
      const [projRes, tasksRes] = await Promise.all([
        projectService.getProjectById(id),
        taskService.getTasks({ projectId: id })
      ]);

      const projData = projRes?.data || projRes;
      if (projData && projData.id) {
        setProject(projData);
      }

      const tasksList = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data || []);
      setTasks(tasksList);
    } catch (err) {
      console.error('Failed to load project details', err);
      showToast('Unable to load project stream details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTaskStatus = async (task) => {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await taskService.updateTask(task.id, { status: nextStatus });
      const isSuccess = res && (res.success || res.status === 200);
      if (isSuccess) {
        showToast(nextStatus === 'Completed' ? 'Task node resolved!' : 'Task set to pending', 'success');
        loadProjectAndTasks();
      }
    } catch (err) {
      showToast('Failed to update task status', 'error');
    }
  };

  const handleTaskDelete = async () => {
    if (!taskToDelete) return;
    setDeletingTask(true);
    try {
      const res = await taskService.deleteTask(taskToDelete.id);
      const isSuccess = res && (res.success || res.status === 200);
      if (isSuccess) {
        showToast('Task node removed from stream', 'info');
        setTasks(tasks.filter(t => t.id !== taskToDelete.id));
        setDeleteTaskModalOpen(false);
        loadProjectAndTasks();
      }
    } catch (err) {
      showToast('Failed to delete task node', 'error');
    } finally {
      setDeletingTask(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
        <KineticLoader size="large" text="Opening Project Stream..." />
      </div>
    );
  }

  if (!project) {
    return (
      <EmptyState
        type="projects"
        title="Project stream not found"
        description="The project stream you requested does not exist or has been removed."
        actionText="Back to Projects"
        onAction={() => navigate('/projects')}
      />
    );
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Back button & Action Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => navigate('/projects')}
          className="btn btn-ghost"
          style={{ gap: '0.5rem', paddingLeft: 0, color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={18} />
          <span>Back to Projects</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="btn btn-secondary"
            style={{ gap: '0.5rem' }}
          >
            <Edit size={16} />
            <span>Edit Project</span>
          </button>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="btn btn-primary"
            style={{ gap: '0.5rem' }}
          >
            <Plus size={16} />
            <span>Add Task Node</span>
          </button>
        </div>
      </div>

      {/* Project Banner Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="kinetic-card"
        style={{ padding: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {project.name}
              </h1>
              <StatusBadge status={project.status} />
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '720px' }}>
              {project.description || 'No description provided.'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>STREAM COMPLETION</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {progressPct}%
            </div>
          </div>
        </div>

        {/* Start / Target End Date Row */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.84rem', color: 'var(--text-secondary)', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          {project.startDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
              <span>Start Date: <strong>{new Date(project.startDate).toLocaleDateString()}</strong></span>
            </div>
          )}
          {project.endDate && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Calendar size={15} style={{ color: 'var(--text-muted)' }} />
              <span>Target Completion: <strong>{new Date(project.endDate).toLocaleDateString()}</strong></span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <CheckCircle2 size={15} style={{ color: '#10b981' }} />
            <span>Resolved Nodes: <strong>{completedTasks} / {totalTasks}</strong></span>
          </div>
        </div>
      </motion.div>

      {/* Signature Interactive Timeline Component */}
      <TimelineNode
        tasks={tasks}
        activeTaskId={activeTimelineTaskId}
        onTaskClick={(task) => setActiveTimelineTaskId(task.id)}
      />

      {/* Associated Task Nodes Stream List */}
      <div className="kinetic-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Project Task Nodes ({tasks.length})
          </h3>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="btn btn-secondary"
            style={{ fontSize: '0.8125rem', gap: '0.375rem' }}
          >
            <Plus size={14} />
            <span>Add Node</span>
          </button>
        </div>

        {tasks.length === 0 ? (
          <EmptyState
            type="tasks"
            title="No task nodes attached to this stream"
            description="Add your first task node to populate the project timeline!"
            onAction={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <AnimatePresence>
              {tasks.map((task) => {
                const isCompleted = task.status === 'Completed';

                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isCompleted ? '#f8fafc' : 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flex: 1, minWidth: 0 }}>
                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: isCompleted ? '#10b981' : '#cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 0
                        }}
                        aria-label="Toggle complete"
                      >
                        <CheckCircle2 size={22} style={{ fill: isCompleted ? '#ecfdf5' : 'transparent' }} />
                      </button>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                          textDecoration: isCompleted ? 'line-through' : 'none'
                        }}>
                          {task.name}
                        </div>
                        {task.description && (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', truncate: true }}>
                            {task.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />

                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setIsTaskModalOpen(true);
                        }}
                        className="btn btn-ghost"
                        style={{ padding: '4px', borderRadius: '4px' }}
                      >
                        <Edit size={15} />
                      </button>

                      <button
                        onClick={() => {
                          setTaskToDelete(task);
                          setDeleteTaskModalOpen(true);
                        }}
                        className="btn btn-ghost"
                        style={{ padding: '4px', borderRadius: '4px', color: '#ef4444' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={editingTask}
        projectId={id}
        onTaskSaved={() => loadProjectAndTasks()}
      />

      {/* Project Modal */}
      <ProjectFormModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectToEdit={project}
        onProjectSaved={() => loadProjectAndTasks()}
      />

      {/* Task Delete Modal */}
      <Modal
        isOpen={deleteTaskModalOpen}
        onClose={() => setDeleteTaskModalOpen(false)}
        title="Remove Task Node?"
        maxWidth="440px"
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Are you sure you want to delete task <strong>"{taskToDelete?.name}"</strong>?
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={() => setDeleteTaskModalOpen(false)} className="btn btn-secondary" disabled={deletingTask}>
            Cancel
          </button>
          <button onClick={handleTaskDelete} className="btn btn-danger" disabled={deletingTask}>
            {deletingTask ? <KineticLoader color="white" text="Deleting..." /> : 'Delete Node'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
