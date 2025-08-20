const { body, param, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const innovationValidators = {
  getById: [
    param('id').isMongoId().withMessage('Invalid innovation ID'),
    validateRequest
  ],
  create: [
    body('title').notEmpty().trim().escape(),
    body('description').notEmpty().trim().escape(),
    validateRequest
  ]
};

module.exports = { innovationValidators };