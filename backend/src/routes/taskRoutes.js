const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');
const { createTaskValidation, updateTaskValidation, taskIdParamValidation } = require('../validators/taskValidator');
const validate = require('../middleware/validate');

// All task routes require authentication
router.use(authenticateToken);

router.get('/', taskController.getTasks);
router.get('/:id', taskIdParamValidation, validate, taskController.getTaskById);
router.post('/', createTaskValidation, validate, taskController.createTask);
router.put('/:id', updateTaskValidation, validate, taskController.updateTask);
router.delete('/:id', taskIdParamValidation, validate, taskController.deleteTask);

module.exports = router;
