import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Plus } from 'lucide-react';
import Modal from '../components/common/Modal';
import KineticLoader from '../components/common/KineticLoader';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';
import CustomSelect from '../components/common/CustomSelect';
import CustomDatePicker from '../components/common/CustomDatePicker';

const TaskFormModal = ({
  isOpen,
  onClose,
  taskToEdit = null,
  projectId = null,
  onTaskSaved
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
    projectId: projectId || ''
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [error, setError] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    try {
      const res = await projectService.getProjects();
      const list = res.data || res;
      if (Array.isArray(list)) {
        setProjects(list);
      } else if (res.success && Array.isArray(res.data)) {
        setProjects(res.data);
      }
    } catch (err) {
      console.error('Failed to load projects list for task modal', err);
    }
  };

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        name: taskToEdit.name || '',
        description: taskToEdit.description || '',
        status: taskToEdit.status || 'Pending',
        priority: taskToEdit.priority || 'Medium',
        dueDate: taskToEdit.dueDate ? taskToEdit.dueDate.split('T')[0] : '',
        projectId: taskToEdit.projectId || projectId || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0],
        projectId: projectId || (projects.length > 0 ? projects[0].id : '')
      });
    }
    setError('');
    setSuccessAnimation(false);
  }, [taskToEdit, projectId, isOpen, projects]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Task name is required.');
      return;
    }

    if (!formData.projectId) {
      setError('Please select a project to associate this task node.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      const payload = {
        ...formData,
        projectId: parseInt(formData.projectId, 10)
      };

      if (taskToEdit) {
        response = await taskService.updateTask(taskToEdit.id, payload);
      } else {
        response = await taskService.createTask(payload);
      }

      setLoading(false);

      const isSuccess = response && (response.success || response.status === 200 || response.status === 201 || Boolean(response.data));
      const savedData = response.data || response;

      if (isSuccess) {
        setSuccessAnimation(true);
        showToast(taskToEdit ? 'Task node updated!' : 'Task node inserted into stream!', 'success');

        setTimeout(() => {
          onTaskSaved && onTaskSaved(savedData);
          onClose();
        }, 400);
      } else {
        setError(response?.message || 'Failed to save task.');
      }
    } catch (err) {
      setLoading(false);
      const errMsg = err.message || (Array.isArray(err.errors) ? err.errors.map(e => e.msg).join(' ') : 'An error occurred while saving task node.');
      setError(errMsg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Update Task Node' : 'Add New Task Node'}
      maxWidth="540px"
    >
      <AnimatePresence mode="wait">
        {successAnimation ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem 1.5rem',
              textAlign: 'center'
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.4 }}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                border: '2px solid #10b981',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
              }}
            >
              <CheckCircle2 size={30} />
            </motion.div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.375rem' }}>
              {taskToEdit ? 'Task Updated' : 'Node Added to Stream!'}
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Workflow metrics recalculating...
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                color: '#b91c1c',
                fontSize: '0.84rem',
                marginBottom: '1.25rem'
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="task-proj">Project Stream *</label>
              <CustomSelect
                id="task-proj"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                placeholder="Select Project Stream"
                options={projects.map((p) => ({ value: p.id, label: p.name }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-name">Task Name *</label>
              <input
                id="task-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Implement JWT Refresh Tokens"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-desc">Task Details</label>
              <textarea
                id="task-desc"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Specify execution steps or acceptance criteria..."
                className="form-textarea"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label" htmlFor="task-status">Status</label>
                <CustomSelect
                  id="task-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    { value: 'Pending', label: 'Pending' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Completed', label: 'Completed' }
                  ]}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-priority">Priority</label>
                <CustomSelect
                  id="task-priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  options={[
                    { value: 'Low', label: 'Low Priority' },
                    { value: 'Medium', label: 'Medium Priority' },
                    { value: 'High', label: 'High Priority' }
                  ]}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-due">Due Date</label>
              <CustomDatePicker
                id="task-due"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 mt-6 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary w-full sm:w-auto"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <KineticLoader color="white" text="Inserting..." />
                ) : (
                  <>
                    <Plus size={16} />
                    <span>{taskToEdit ? 'Save Node' : 'Insert Task Node'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default TaskFormModal;
