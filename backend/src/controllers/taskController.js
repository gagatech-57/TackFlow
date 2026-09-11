const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * GET /api/tasks
 * View all tasks associated with logged-in user with filters and search
 */
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { projectId, search, status, priority, page = 1, limit = 100, sortBy = 'createdAt', order = 'desc' } = req.query;

    const whereClause = {
      userId, // User isolation check
      ...(projectId && { projectId: parseInt(projectId, 10) }),
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      })
    };

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        include: {
          project: {
            select: { id: true, name: true, status: true }
          }
        },
        orderBy: {
          [sortBy]: order.toLowerCase() === 'asc' ? 'asc' : 'desc'
        },
        skip,
        take
      }),
      prisma.task.count({ where: whereClause })
    ]);

    return successResponse(res, 200, 'Tasks retrieved successfully.', tasks, {
      totalCount,
      page: parseInt(page, 10),
      totalPages: Math.ceil(totalCount / take)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/tasks/:id
 * View individual task owned by logged-in user
 */
const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id, 10);

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId
      },
      include: {
        project: {
          select: { id: true, name: true, status: true }
        }
      }
    });

    if (!task) {
      return errorResponse(res, 404, 'Task not found or access denied.');
    }

    return successResponse(res, 200, 'Task details retrieved successfully.', task);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks
 * Create task under a project owned by logged-in user
 */
const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { projectId, name, description, priority, status, dueDate } = req.body;
    const parsedProjectId = parseInt(projectId, 10);

    // Verify project exists and belongs to authenticated user
    const project = await prisma.project.findFirst({
      where: { id: parsedProjectId, userId }
    });

    if (!project) {
      return errorResponse(res, 404, 'Project not found or access denied. Cannot add task.');
    }

    const task = await prisma.task.create({
      data: {
        projectId: parsedProjectId,
        userId,
        name,
        description: description || null,
        priority: priority || 'Medium',
        status: status || 'Pending',
        dueDate: dueDate ? new Date(dueDate) : null
      },
      include: {
        project: {
          select: { id: true, name: true }
        }
      }
    });

    return successResponse(res, 201, 'Task created successfully.', task);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/:id
 * Edit task owned by logged-in user
 */
const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id, 10);
    const { projectId, name, description, priority, status, dueDate } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId }
    });

    if (!existingTask) {
      return errorResponse(res, 404, 'Task not found or access denied.');
    }

    // If changing project, ensure target project belongs to user
    let targetProjectId = existingTask.projectId;
    if (projectId && parseInt(projectId, 10) !== existingTask.projectId) {
      targetProjectId = parseInt(projectId, 10);
      const project = await prisma.project.findFirst({
        where: { id: targetProjectId, userId }
      });
      if (!project) {
        return errorResponse(res, 404, 'Target project not found or access denied.');
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        projectId: targetProjectId,
        name: name !== undefined ? name : existingTask.name,
        description: description !== undefined ? description : existingTask.description,
        priority: priority || existingTask.priority,
        status: status || existingTask.status,
        dueDate: dueDate !== undefined ? (dueDate ? new Date(dueDate) : null) : existingTask.dueDate
      },
      include: {
        project: {
          select: { id: true, name: true }
        }
      }
    });

    return successResponse(res, 200, 'Task updated successfully.', updatedTask);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete task owned by logged-in user
 */
const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = parseInt(req.params.id, 10);

    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId }
    });

    if (!existingTask) {
      return errorResponse(res, 404, 'Task not found or access denied.');
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    return successResponse(res, 200, 'Task deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
