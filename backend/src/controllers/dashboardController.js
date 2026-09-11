const prisma = require('../config/db');
const { successResponse } = require('../utils/responseHandler');

/**
 * GET /api/dashboard
 * Calculate metrics exclusively for authenticated user
 */
const getDashboardMetrics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Run parallel counts scoped strictly by userId
    const [
      totalProjects,
      projectsInProgress,
      totalTasks,
      completedTasks,
      pendingTasks,
      tasksInProgress,
      recentProjects,
      upcomingTasks
    ] = await Promise.all([
      // Total projects owned by user
      prisma.project.count({ where: { userId } }),
      // Projects in progress owned by user
      prisma.project.count({ where: { userId, status: 'In Progress' } }),
      // Total tasks owned by user
      prisma.task.count({ where: { userId } }),
      // Completed tasks owned by user
      prisma.task.count({ where: { userId, status: 'Completed' } }),
      // Pending tasks owned by user
      prisma.task.count({ where: { userId, status: 'Pending' } }),
      // In Progress tasks owned by user
      prisma.task.count({ where: { userId, status: 'In Progress' } }),
      // Top 5 recent projects for quick dashboard list
      prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          _count: { select: { tasks: true } }
        }
      }),
      // Top 5 urgent / upcoming tasks
      prisma.task.findMany({
        where: { userId, status: { not: 'Completed' } },
        orderBy: { dueDate: 'asc' },
        take: 5,
        include: {
          project: { select: { id: true, name: true } }
        }
      })
    ]);

    const metrics = {
      totalProjects,
      projectsInProgress,
      totalTasks,
      completedTasks,
      pendingTasks,
      tasksInProgress,
      recentProjects,
      upcomingTasks
    };

    return successResponse(res, 200, 'Dashboard metrics calculated successfully.', metrics);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardMetrics
};
