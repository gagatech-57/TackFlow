const { body, param } = require('express-validator');

const validStatuses = ['Not Started', 'In Progress', 'Completed'];

const createProjectValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project Name is required.')
    .isLength({ min: 2, max: 150 })
    .withMessage('Project Name must be between 2 and 150 characters.'),
  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be text.'),
  body('status')
    .optional({ nullable: true })
    .trim()
    .isIn(validStatuses)
    .withMessage(`Status must be one of: ${validStatuses.join(', ')}`),
  body('startDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('Start Date must be a valid YYYY-MM-DD date.'),
  body('endDate')
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage('End Date must be a valid YYYY-MM-DD date.')
    .custom((endDate, { req }) => {
      if (endDate && req.body.startDate) {
        if (new Date(endDate) < new Date(req.body.startDate)) {
          throw new Error('End Date cannot be before Start Date.');
        }
      }
      return true;
    })
];

const updateProjectValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid project ID parameter.'),
  ...createProjectValidation
];

const projectIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid project ID parameter.')
];

module.exports = {
  createProjectValidation,
  updateProjectValidation,
  projectIdParamValidation
};
