const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/auth');
const { createProjectValidation, updateProjectValidation, projectIdParamValidation } = require('../validators/projectValidator');
const validate = require('../middleware/validate');

// All project routes require authentication
router.use(authenticateToken);

router.get('/', projectController.getProjects);
router.get('/:id', projectIdParamValidation, validate, projectController.getProjectById);
router.post('/', createProjectValidation, validate, projectController.createProject);
router.put('/:id', updateProjectValidation, validate, projectController.updateProject);
router.delete('/:id', projectIdParamValidation, validate, projectController.deleteProject);

module.exports = router;
