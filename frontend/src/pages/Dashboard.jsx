import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { calculateProjectProgress } from '../utils/progress';
import KineticLoader from '../components/common/KineticLoader';
import AnimatedNumber from '../components/common/AnimatedNumber';
import StatusBadge, { PriorityBadge } from '../components/common/Badge';
import ProjectIcon from '../components/common/ProjectIcon';
import ProjectFormModal from './ProjectFormModal';
import TaskFormModal from './TaskFormModal';

import { pageCache } from '../utils/cache';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(pageCache.dashboard?.metrics || {
    totalProjects: 0,
    projectsInProgress: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });

  const [recentProjects, setRecentProjects] = useState(pageCache.dashboard?.recentProjects || []);
  const [urgentTasks, setUrgentTasks] = useState(pageCache.dashboard?.urgentTasks || []);
  const [loading, setLoading] = useState(!pageCache.dashboard);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    if (pageCache.dashboard) {
      loadDashboardData(true);
    } else {
      loadDashboardData(false);
    }
  }, []);

  const loadDashboardData = async (isSilent = false) => {
    if (!isSilent && !pageCache.dashboard) setLoading(true);
    try {
      const [metricsRes, projectsRes, tasksRes] = await Promise.all([
        dashboardService.getMetrics(),
        projectService.getProjects(),
        taskService.getTasks()
      ]);

      let formattedMetrics = metrics;
      const metricsData = metricsRes?.data || metricsRes;
      if (metricsData && typeof metricsData === 'object') {
        formattedMetrics = {
          totalProjects: metricsData.totalProjects || 0,
          projectsInProgress: metricsData.projectsInProgress || 0,
          totalTasks: metricsData.totalTasks || 0,
          completedTasks: metricsData.completedTasks || 0,
          pendingTasks: metricsData.pendingTasks || 0
        };
        setMetrics(formattedMetrics);
      }

      const projList = Array.isArray(projectsRes) ? projectsRes : (projectsRes?.data || []);
      const formattedRecent = projList.slice(0, 4);
      setRecentProjects(formattedRecent);

      const tasksList = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data || []);
      const formattedUrgent = tasksList
        .filter(t => t.status !== 'Completed')
        .sort((a, b) => (a.priority === 'High' ? -1 : 1))
        .slice(0, 5);
      setUrgentTasks(formattedUrgent);

      // Store in session cache
      pageCache.dashboard = {
        metrics: formattedMetrics,
        recentProjects: formattedRecent,
        urgentTasks: formattedUrgent
      };
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* A. Dynamic Personal Greeting & Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200"
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
            {getGreeting()}, {(user?.name || user?.fullName) ? (user.name || user.fullName).split(' ')[0] : 'Workspace Member'} 👋
          </h1>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Here is the current momentum and flow state of your projects.
          </p>
        </div>
      </motion.div>

      {/* B. Project Pulse & Task Metrics Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Total Projects */}
        <motion.div
          whileHover={{ y: -3 }}
          className="kinetic-card p-5 w-full min-w-0"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>TOTAL PROJECTS</span>
            <ProjectIcon size={18} bgClassName="bg-blue-50 text-blue-600" />
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.125rem' }}>
            <AnimatedNumber value={metrics.totalProjects} />
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {metrics.projectsInProgress} currently active streams
          </div>
        </motion.div>

        {/* Metric 2: Active Tasks */}
        <motion.div
          whileHover={{ y: -3 }}
          className="kinetic-card p-5 w-full min-w-0"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>TOTAL TASK NODES</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f0fdf4', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.125rem' }}>
            <AnimatedNumber value={metrics.totalTasks} />
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Across all project streams
          </div>
        </motion.div>

        {/* Metric 3: Completed Tasks */}
        <motion.div
          whileHover={{ y: -3 }}
          className="kinetic-card p-5 w-full min-w-0"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>COMPLETED NODES</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#047857', marginBottom: '0.125rem' }}>
            <AnimatedNumber value={metrics.completedTasks} />
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            {taskCompletionRate}% resolution rate
          </div>
        </motion.div>

        {/* Metric 4: Pending / In-Flight Tasks */}
        <motion.div
          whileHover={{ y: -3 }}
          className="kinetic-card p-5 w-full min-w-0"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>IN-FLIGHT TASKS</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fffbeb', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.875rem', fontWeight: 800, color: '#b45309', marginBottom: '0.125rem' }}>
            <AnimatedNumber value={metrics.pendingTasks} />
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Pending node execution
          </div>
        </motion.div>
      </div>

      {/* D & E. Two Column Layout: Recent Projects + Urgent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0">
        {/* D. Recent Projects Stream */}
        <div className="kinetic-card p-5 sm:p-6 w-full min-w-0">
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
                const pct = calculateProjectProgress(project);
                const taskCount = project.tasks ? project.tasks.length : (project._count?.tasks || 0);

                return (
                  <motion.div
                    key={project.id}
                    whileHover={{ x: 3 }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="flex flex-col gap-2.5 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer w-full min-w-0 hover:border-slate-300 transition-all"
                  >
                    {/* ROW 1: Project Name + Status */}
                    <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <ProjectIcon size={14} bgClassName="bg-blue-100/60 text-blue-700 p-1.5" />
                        <span className="text-sm font-bold text-slate-900 break-words line-clamp-1">
                          {project.name}
                        </span>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>

                    {/* ROW 2: Task Count + Completion Percentage */}
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>{taskCount} tasks</span>
                      <span className="font-bold text-blue-600">{pct}% completed</span>
                    </div>

                    {/* ROW 3: Progress Bar + Percentage Circle + Action Arrow */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center font-mono text-[0.7rem] font-bold text-blue-600 shadow-sm">
                        {pct}%
                      </div>

                      <ArrowRight size={16} className="shrink-0 text-slate-400" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* E. Urgent Tasks Stream */}
        <div className="kinetic-card p-5 sm:p-6 w-full min-w-0">
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
                  className="flex flex-col gap-2 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 w-full min-w-0"
                >
                  {/* ROW 1: Task Name */}
                  <div className="text-sm font-semibold text-slate-900 break-words">
                    {task.name}
                  </div>

                  {/* ROW 2: Project + Due Date */}
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-blue-600">{task.project?.name || 'Project'}</span>
                    {task.dueDate && <span>&bull; Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>

                  {/* ROW 3: Priority + Status Badges */}
                  <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-200/60">
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
        onProjectSaved={() => loadDashboardData(true)}
      />
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onTaskSaved={() => loadDashboardData(true)}
      />
    </div>
  );
};

export default Dashboard;
