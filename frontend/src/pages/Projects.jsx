import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Calendar, FolderKanban, ArrowRight, Edit, Trash2, X } from 'lucide-react';
import { projectService } from '../services/projectService';
import StatusBadge from '../components/common/Badge';
import KineticLoader from '../components/common/KineticLoader';
import EmptyState from '../components/common/EmptyState';
import ProjectFormModal from './ProjectFormModal';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await projectService.getProjects();
      if (res.data.success) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
      showToast('Failed to load project streams', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (e, project) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const confirmDelete = (e, project) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      const res = await projectService.deleteProject(projectToDelete.id);
      if (res.data.success) {
        showToast('Project stream removed', 'info');
        setProjects(projects.filter(p => p.id !== projectToDelete.id));
        setDeleteModalOpen(false);
      }
    } catch (err) {
      showToast('Failed to delete project stream', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Filter & Search Logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Project Streams
            </h1>
            <span style={{
              fontSize: '0.8125rem',
              fontWeight: 700,
              padding: '0.2rem 0.625rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)'
            }}>
              {projects.length} Total
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
            Manage active workflows and track milestones across project nodes.
          </p>
        </div>

        <button onClick={handleCreateNew} className="btn btn-primary" style={{ gap: '0.5rem' }}>
          <Plus size={16} />
          <span>Ignite New Project</span>
        </button>
      </div>

      {/* Search Bar & Status Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Animated Focus Search Bar */}
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project streams by name or description..."
            className="form-input"
            style={{ paddingLeft: '2.5rem', paddingRight: searchQuery ? '2rem' : '0.875rem' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {['All', 'In Progress', 'Pending', 'Completed', 'Not Started'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '0.4rem 0.875rem',
                fontSize: '0.8125rem',
                fontWeight: statusFilter === status ? 600 : 500,
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: statusFilter === status ? 'var(--primary)' : 'var(--border-subtle)',
                backgroundColor: statusFilter === status ? 'var(--primary-light)' : 'transparent',
                color: statusFilter === status ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
          <KineticLoader size="medium" text="Loading project streams..." />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          type={searchQuery || statusFilter !== 'All' ? 'search' : 'projects'}
          onAction={searchQuery || statusFilter !== 'All' ? null : handleCreateNew}
        />
      ) : (
        <motion.div
          layout
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}
        >
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const totalTasks = project.tasks ? project.tasks.length : 0;
              const completedTasks = project.tasks ? project.tasks.filter(t => t.status === 'Completed').length : 0;
              const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -3 }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="kinetic-card-interactive"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {project.name}
                      </h3>
                      <StatusBadge status={project.status} />
                    </div>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '1.25rem',
                      display: '-webkit-box',
                      lineClamp: 2,
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.5rem'
                    }}>
                      {project.description || 'No description provided for this project stream.'}
                    </p>
                  </div>

                  <div>
                    {/* Progress Bar */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                        <span>Stream Completion</span>
                        <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{progressPct}%</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${progressPct}%`,
                          background: 'linear-gradient(90deg, #2563eb, #10b981)',
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.875rem',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Calendar size={14} />
                        <span>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'No date'}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => handleEdit(e, project)}
                          className="btn btn-ghost"
                          style={{ padding: '4px', borderRadius: '4px' }}
                          aria-label="Edit project"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={(e) => confirmDelete(e, project)}
                          className="btn btn-ghost"
                          style={{ padding: '4px', borderRadius: '4px', color: '#ef4444' }}
                          aria-label="Delete project"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Create / Edit Project Modal */}
      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={editingProject}
        onProjectSaved={() => loadProjects()}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Project Stream?"
        maxWidth="440px"
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Are you sure you want to delete <strong>"{projectToDelete?.name}"</strong>? All associated task nodes will be permanently removed.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="btn btn-secondary"
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={deleting}
          >
            {deleting ? <KineticLoader size="small" text={null} /> : 'Delete Stream'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;
