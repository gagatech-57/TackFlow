import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, Clock, AlertTriangle, Plus, ArrowRight, TrendingUp, FolderKanban } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import KineticLoader from '../components/common/KineticLoader';
import AnimatedNumber from '../components/common/AnimatedNumber';
import StatusBadge, { PriorityBadge } from '../components/common/Badge';
import ProjectFormModal from './ProjectFormModal';
import TaskFormModal from './TaskFormModal';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    projectsInProgress: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, projectsRes, tasksRes] = await Promise.all([
        dashboardService.getMetrics(),
        projectService.getProjects(),
        taskService.getTasks()
      ]);

      const metricsData = metricsRes?.data || metricsRes;
      if (metricsData && typeof metricsData === 'object') {
        setMetrics({
          totalProjects: metricsData.totalProjects || 0,
          projectsInProgress: metricsData.projectsInProgress || 0,
          totalTasks: metricsData.totalTasks || 0,
          completedTasks: metricsData.completedTasks || 0,
          pendingTasks: metricsData.pendingTasks || 0
        });
      }

      const projList = Array.isArray(projectsRes) ? projectsRes : (projectsRes?.data || []);
      setRecentProjects(projList.slice(0, 4));

      const tasksList = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data || []);
      const urgent = tasksList
        .filter(t => t.status !== 'Completed')
        .sort((a, b) => (a.priority === 'High' ? -1 : 1))
        .slice(0, 5);
      setUrgentTasks(urgent);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
        <KineticLoader size="large" text="Calculating Project Pulse..." />
      </div>
    );
  }

  // Calculate task completion percentage
  const taskCompletionRate = metrics.totalTasks > 0
    ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* A. Dynamic Personal Greeting & Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
            {getGreeting()}, {(user?.name || user?.fullName) ? (user.name || user.fullName).split(' ')[0] : 'Workspace Member'} 👋
          </h1>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Here is the current momentum and flow state of your projects.
          </p>
        </div>
      </motion.div>

      {/* B. Project Pulse & Task Metrics Overview Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem'
      }}>
        {/* Metric 1: Total Projects */}
        <motion.div
          whileHover={{ y: -3 }}
          className="kinetic-card"
          style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL PROJECTS</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderKanban size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            <AnimatedNumber value={metrics.totalProjects} />
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {metrics.projectsInProgress} currently active streams
          </div>
        </motion.div>

        {/* Metric 2: Active Tasks */}
        <motion.div
          whileHover={{ y: -3 }}
          className="kinetic-card"
          style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL TASK NODES</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f0fdf4', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            <AnimatedNumber value={metrics.totalTasks} />
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Across all project streams
          </div>
        </motion.div>

        {/* Metric 3: Completed Tasks */}
        <motion.div
          whileHover={{ y: -3 }}
          className="kinetic-card"
          style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>COMPLETED NODES</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#047857', marginBottom: '0.25rem' }}>
            <AnimatedNumber value={metrics.completedTasks} />
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {taskCompletionRate}% resolution rate
          </div>
        </motion.div>

        {/* Metric 4: Pending / In-Flight Tasks */}
        <motion.div
          whileHover={{ y: -3 }}
          className="kinetic-card"
          style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>IN-FLIGHT TASKS</span>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#b45309', marginBottom: '0.25rem' }}>
            <AnimatedNumber value={metrics.pendingTasks} />
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Pending node execution
          </div>
        </motion.div>
      </div>



      {/* D & E. Two Column Layout: Recent Projects + Urgent Tasks */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* D. Recent Projects Stream */}
        <div className="kinetic-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Recent Projects
            </h3>
            <button
              onClick={() => navigate('/projects')}
              className="btn btn-ghost"
              style={{ fontSize: '0.8125rem', gap: '0.25rem', padding: '0.375rem 0.625rem' }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {recentProjects.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No projects created yet. Click "Ignite Project" to start!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {recentProjects.map((project) => {
                const total = project.tasks ? project.tasks.length : (project._count ? project._count.tasks : 0);
                const completed = project.tasks ? project.tasks.filter(t => t.status === 'Completed').length : 0;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                return (
                  <motion.div
                    key={project.id}
                    whileHover={{ x: 3 }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-main)', truncate: true }}>
                          {project.name}
                        </span>
                        <StatusBadge status={project.status} />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {total} tasks &bull; {pct}% resolved
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--primary)'
                      }}>
                        {pct}%
                      </div>
                      <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* E. Urgent Tasks Stream */}
        <div className="kinetic-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Urgent Task Stream
            </h3>
            <button
              onClick={() => navigate('/tasks')}
              className="btn btn-ghost"
              style={{ fontSize: '0.8125rem', gap: '0.25rem', padding: '0.375rem 0.625rem' }}
            >
              <span>Task Stream</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {urgentTasks.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              All urgent tasks are resolved! Clear workspace stream.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {urgentTasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.875rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {task.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{task.project?.name || 'Project'}</span>
                      {task.dueDate && <span>&bull; Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ProjectFormModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectSaved={() => loadDashboardData()}
      />
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskSaved={() => loadDashboardData()}
      />
    </div>
  );
};

export default Dashboard;
