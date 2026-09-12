import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Calendar, Edit, Trash2, X } from 'lucide-react';
import { projectService } from '../services/projectService';
import { calculateProjectProgress } from '../utils/progress';
import StatusBadge from '../components/common/Badge';
import KineticLoader from '../components/common/KineticLoader';
import EmptyState from '../components/common/EmptyState';
import ProjectFormModal from './ProjectFormModal';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import ProjectIcon from '../components/common/ProjectIcon';

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
      const list = Array.isArray(res) ? res : (res?.data || []);
      setProjects(list);
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
      const isSuccess = res && (res.success || res.status === 200);
      if (isSuccess) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
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
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.125rem' }}>
            Manage active workflows and track milestones across project nodes.
          </p>
        </div>

        <button onClick={handleCreateNew} className="btn btn-primary w-full sm:w-auto" style={{ gap: '0.5rem', fontWeight: 700 }}>
          <Plus size={18} />
          <span>Ignite New Project</span>
        </button>
      </div>

      {/* Search Bar & Status Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-sm w-full min-w-0">
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: 1, width: '100%', minWidth: 0 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project streams by name or description..."
            className="form-input w-full"
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

        {/* Isolated Filter Pills Horizontal Scroll Container */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 whitespace-nowrap shrink-0">
          {['All', 'In Progress', 'Pending', 'Completed', 'Not Started'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '0.4rem 0.875rem',
                fontSize: '0.8125rem',
                fontWeight: statusFilter === status ? 700 : 500,
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: statusFilter === status ? 'var(--primary)' : 'var(--border-subtle)',
                backgroundColor: statusFilter === status ? 'var(--primary-light)' : 'transparent',
                color: statusFilter === status ? 'var(--primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                whiteSpace: 'nowrap'
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
          <KineticLoader size="large" text="Loading project streams..." />
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          type={searchQuery || statusFilter !== 'All' ? 'search' : 'projects'}
          onAction={searchQuery || statusFilter !== 'All' ? null : handleCreateNew}
        />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full min-w-0"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => {
              const progressPct = calculateProjectProgress(project);

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -3 }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="kinetic-card-interactive p-5 sm:p-6 w-full min-w-0 flex flex-col justify-between cursor-pointer relative"
                >
                  <div>
                    {/* ROW 1: Project Icon + Project Name + Status */}
                    <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <ProjectIcon size={16} bgClassName="bg-blue-100/70 text-blue-700 p-2" />
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug break-words">
                          {project.name}
                        </h3>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem] break-words">
                      {project.description || 'No description provided for this project stream.'}
                    </p>
                  </div>

                  <div>
                    {/* Progress Section */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
                        <span>Stream Completion</span>
                        <span className="color-primary font-mono font-bold">{progressPct}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Date + Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'No date'}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleEdit(e, project)}
                          className="btn btn-ghost p-1.5 text-slate-500 hover:text-blue-600"
                          aria-label="Edit project"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={(e) => confirmDelete(e, project)}
                          className="btn btn-ghost p-1.5 text-slate-500 hover:text-red-600"
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
            {deleting ? <KineticLoader color="white" text="Deleting..." /> : 'Delete Stream'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;
