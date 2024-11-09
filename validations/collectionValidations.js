const { body } = require('express-validator');

const validateCreateCollection = [
    body('name')
        .isString().withMessage('Name must be a string.')
        .notEmpty().withMessage('Name is required.')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long.'),

    body('description')
        .optional()
        .isString().withMessage('Description must be a string.')
        .isLength({ max: 500 }).withMessage('Description can be up to 500 characters long.')
];

module.exports = {
    validateCreateCollection,
};
