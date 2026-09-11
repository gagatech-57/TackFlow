const { body, param } = require('express-validator');

const validPriorities = ['Low', 'Medium', 'High'];
const validStatuses = ['Pending', 'In Progress', 'Completed'];

const createTaskValidation = [
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required.')
    .isInt({ min: 1 })
    .withMessage('Project ID must be a valid positive integer.'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Task Name is required.')
    .isLength({ min: 2, max: 150 })
    .withMessage('Task Name must be between 2 and 150 characters.'),
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be text.'),
  body('priority')
    .optional({ nullable: true })
    .trim()
    .isIn(validPriorities)
    .withMessage(`Priority must be one of: ${validPriorities.join(', ')}`),
  body('status')
    .optional({ nullable: true })
    .trim()
    .isIn(validStatuses)
    .withMessage(`Status must be one of: ${validStatuses.join(', ')}`),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Due Date must be a valid YYYY-MM-DD date.')
];

const updateTaskValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid task ID parameter.'),
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task Name cannot be empty.')
    .isLength({ min: 2, max: 150 })
    .withMessage('Task Name must be between 2 and 150 characters.'),
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be text.'),
  body('priority')
    .optional({ nullable: true })
    .trim()
    .isIn(validPriorities)
    .withMessage(`Priority must be one of: ${validPriorities.join(', ')}`),
  body('status')
    .optional({ nullable: true })
    .trim()
    .isIn(validStatuses)
    .withMessage(`Status must be one of: ${validStatuses.join(', ')}`),
  body('dueDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Due Date must be a valid YYYY-MM-DD date.'),
  body('projectId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Project ID must be a valid positive integer.')
];

const taskIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid task ID parameter.')
];

module.exports = {
  createTaskValidation,
  updateTaskValidation,
  taskIdParamValidation
};
