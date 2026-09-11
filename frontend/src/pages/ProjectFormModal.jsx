import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Calendar, CheckCircle2, Plus } from 'lucide-react';
import Modal from '../components/common/Modal';
import KineticLoader from '../components/common/KineticLoader';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';

const ProjectFormModal = ({ isOpen, onClose, projectToEdit = null, onProjectSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'In Progress',
    startDate: '',
    endDate: ''
  });

  const [loading, setLoading] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [error, setError] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        name: projectToEdit.name || '',
        description: projectToEdit.description || '',
        status: projectToEdit.status || 'In Progress',
        startDate: projectToEdit.startDate ? projectToEdit.startDate.split('T')[0] : '',
        endDate: projectToEdit.endDate ? projectToEdit.endDate.split('T')[0] : ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'In Progress',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
      });
    }
    setError('');
    setSuccessAnimation(false);
  }, [projectToEdit, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Project name is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      if (projectToEdit) {
        response = await projectService.updateProject(projectToEdit.id, formData);
      } else {
        response = await projectService.createProject(formData);
      }

      setLoading(false);

      if (response.data.success) {
        setSuccessAnimation(true);
        showToast(projectToEdit ? 'Project updated successfully!' : 'Project stream ignited!', 'success');

        // Play Kinetic Success Animation before closing
        setTimeout(() => {
          onProjectSaved && onProjectSaved(response.data.data);
          onClose();
        }, 1200);
      } else {
        setError(response.data.message || 'Failed to save project.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred while saving project.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Update Project Parameters' : 'Ignite New Project Stream'}
      maxWidth="560px"
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
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
              transition={{ duration: 0.5 }}
              style={{
                width: '64px',
                height: '64px',
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
              <CheckCircle2 size={32} />
            </motion.div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {projectToEdit ? 'Project Updated!' : 'Project Stream Activated!'}
            </h4>

            {/* Kinetic Progress Bar Animation */}
            <div style={{
              width: '180px',
              height: '4px',
              backgroundColor: '#e2e8f0',
              borderRadius: '2px',
              overflow: 'hidden',
              marginTop: '0.5rem'
            }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{ height: '100%', backgroundColor: '#10b981' }}
              />
            </div>
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
              <label className="form-label" htmlFor="proj-name">Project Name *</label>
              <input
                id="proj-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. TaskFlow Kinetic Workspace Redesign"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proj-desc">Description</label>
              <textarea
                id="proj-desc"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe the workflow goals and scope..."
                className="form-textarea"
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="proj-status">Workflow Status</label>
                <select
                  id="proj-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="proj-start">Start Date</label>
                <input
                  id="proj-start"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proj-end">Target End Date</label>
              <input
                id="proj-end"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <KineticLoader size="small" text={null} />
                ) : (
                  <>
                    <Plus size={16} />
                    <span>{projectToEdit ? 'Save Changes' : 'Ignite Project'}</span>
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

export default ProjectFormModal;
