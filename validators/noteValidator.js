const { body } = require('express-validator');

const createNoteValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title must be under 100 characters'),

    body('content')
        .optional()
        .isLength({ max: 5000 }).withMessage('Content must be under 5000 characters'),

    body('colour')
        .optional()
        .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/).withMessage('Colour must be a valid hex code'),

    body('isPinned')
        .optional()
        .isBoolean().withMessage('isPinned must be a boolean'),
];

const updateNoteValidator = [
    body('title')
        .optional()
        .trim()
        .notEmpty().withMessage('Title cannot be empty')
        .isLength({ max: 100 }).withMessage('Title must be under 100 characters'),

    body('content')
        .optional()
        .isLength({ max: 5000 }).withMessage('Content must be under 5000 characters'),

    body('colour')
        .optional()
        .matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/).withMessage('Colour must be a valid hex code'),

    body('isPinned')
        .optional()
        .isBoolean().withMessage('isPinned must be a boolean'),
];

module.exports = { createNoteValidator, updateNoteValidator };