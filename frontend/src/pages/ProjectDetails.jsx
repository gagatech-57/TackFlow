import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Calendar, Edit, Trash2, CheckCircle2, Clock, Circle, Filter } from 'lucide-react';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { calculateProjectProgress } from '../utils/progress';
import StatusBadge, { PriorityBadge } from '../components/common/Badge';
import KineticLoader from '../components/common/KineticLoader';
import TimelineNode from '../components/common/TimelineNode';
import TaskFormModal from './TaskFormModal';
import ProjectFormModal from './ProjectFormModal';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';
import ProjectIcon from '../components/common/ProjectIcon';

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

  const loadProjectAndTasks = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
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
      if (!isSilent) showToast('Unable to load project stream details', 'error');
    } finally {
      if (!isSilent) setLoading(false);
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
  const progressPct = calculateProjectProgress(project, tasks);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="btn btn-ghost self-start"
          style={{ gap: '0.5rem', paddingLeft: 0, color: 'var(--text-secondary)', fontWeight: 700 }}
        >
          <ArrowLeft size={18} />
          <span>Back to Projects</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="btn btn-secondary flex-1 sm:flex-initial"
            style={{ gap: '0.5rem', fontWeight: 700 }}
          >
            <Edit size={16} />
            <span>Edit Project</span>
          </button>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="btn btn-primary flex-1 sm:flex-initial"
            style={{ gap: '0.5rem', fontWeight: 700 }}
          >
            <Plus size={18} />
            <span>Add Task Node</span>
          </button>
        </div>
      </div>

      {/* Project Banner Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="kinetic-card p-5 sm:p-8 w-full min-w-0"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <ProjectIcon size={20} bgClassName="bg-blue-100/70 text-blue-700 p-2.5" />
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', wordBreak: 'break-word' }}>
                {project.name}
              </h1>
              <StatusBadge status={project.status} />
            </div>
            <p style={{ fontSize: '0.925rem', fontWeight: 500, color: 'var(--text-secondary)', maxWidth: '720px' }}>
              {project.description || 'No description provided.'}
            </p>
          </div>

          <div className="md:text-right flex items-center md:flex-col gap-2 md:gap-0 justify-between">
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>STREAM COMPLETION</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
              {progressPct}%
            </div>
          </div>
        </div>

        {/* Start / Target End Date Row */}
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.84rem', color: 'var(--text-secondary)', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
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
      <div className="kinetic-card p-5 sm:p-6 w-full min-w-0">
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
              {[...tasks].sort((a, b) => {
                if (a.createdAt && b.createdAt) {
                  return new Date(a.createdAt) - new Date(b.createdAt);
                }
                return (a.id || 0) - (b.id || 0);
              }).map((task) => {
                const isCompleted = task.status === 'Completed';

                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-slate-200 w-full min-w-0"
                    style={{
                      backgroundColor: isCompleted ? '#f8fafc' : 'var(--bg-app)',
                    }}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => handleToggleTaskStatus(task)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: isCompleted ? '#10b981' : '#cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          padding: 0,
                          marginTop: '2px'
                        }}
                        aria-label="Toggle complete"
                      >
                        <CheckCircle2 size={22} style={{ fill: isCompleted ? '#ecfdf5' : 'transparent' }} />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold break-words" style={{
                          color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                          textDecoration: isCompleted ? 'line-through' : 'none'
                        }}>
                          {task.name}
                        </div>
                        {task.description && (
                          <div className="text-xs text-slate-500 line-clamp-1 break-words">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                      <div className="flex items-center gap-2 flex-wrap">
                        <PriorityBadge priority={task.priority} />
                        <StatusBadge status={task.status} />
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setIsTaskModalOpen(true);
                          }}
                          className="btn btn-ghost"
                          style={{ padding: '4px', borderRadius: '4px' }}
                          aria-label="Edit task"
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
                          aria-label="Delete task"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
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
        onTaskSaved={() => loadProjectAndTasks(true)}
      />

      {/* Project Modal */}
      <ProjectFormModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectToEdit={project}
        onProjectSaved={() => loadProjectAndTasks(true)}
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
