const userService = require('../services/userService');
const AppError = require('../utils/errorUtils');

const checkUserExists = async (req, res, next) => {
    const userId = req.headers['user_id'];

    try {
        if (!userId) {
            return next(new AppError('User ID must be provided', 400));
        }

        const result = await userService.checkUserExists(userId);

        if (!result) {
            return next(new AppError(`User with ID ${userId} does not exist`, 404));
        }

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }

        return next(new AppError('Database error while checking userId.', 500));
    }
};

module.exports = checkUserExists;
