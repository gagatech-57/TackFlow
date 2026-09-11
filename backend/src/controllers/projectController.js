const prisma = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * GET /api/projects
 * View all projects owned by logged-in user with search & filtering
 */
const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { search, status, page = 1, limit = 100, sortBy = 'createdAt', order = 'desc' } = req.query;

    const whereClause = {
      userId,
      ...(status && { status }),
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive'
        }
      })
    };

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where: whereClause,
        include: {
          _count: {
            select: { tasks: true }
          }
        },
        orderBy: {
          [sortBy]: order.toLowerCase() === 'asc' ? 'asc' : 'desc'
        },
        skip,
        take
      }),
      prisma.project.count({ where: whereClause })
    ]);

    return successResponse(res, 200, 'Projects retrieved successfully.', projects, {
      totalCount,
      page: parseInt(page, 10),
      totalPages: Math.ceil(totalCount / take)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/projects/:id
 * View single project details owned by logged-in user
 */
const getProjectById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = parseInt(req.params.id, 10);

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId // Ensure strict multi-tenant ownership check
      },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return errorResponse(res, 404, 'Project not found or access denied.');
    }

    return successResponse(res, 200, 'Project details retrieved successfully.', project);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/projects
 * Create a new project for logged-in user
 */
const createProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description, status, startDate, endDate } = req.body;

    const project = await prisma.project.create({
      data: {
        userId,
        name,
        description: description || null,
        status: status || 'Not Started',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null
      }
    });

    return successResponse(res, 201, 'Project created successfully.', project);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/projects/:id
 * Edit project owned by logged-in user
 */
const updateProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = parseInt(req.params.id, 10);
    const { name, description, status, startDate, endDate } = req.body;

    // Check ownership
    const existingProject = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!existingProject) {
      return errorResponse(res, 404, 'Project not found or access denied.');
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description: description !== undefined ? description : existingProject.description,
        status: status || existingProject.status,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : existingProject.startDate,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existingProject.endDate
      }
    });

    return successResponse(res, 200, 'Project updated successfully.', updatedProject);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/projects/:id
 * Delete project owned by logged-in user
 */
const deleteProject = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = parseInt(req.params.id, 10);

    const existingProject = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!existingProject) {
      return errorResponse(res, 404, 'Project not found or access denied.');
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    return successResponse(res, 200, 'Project and associated tasks deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
