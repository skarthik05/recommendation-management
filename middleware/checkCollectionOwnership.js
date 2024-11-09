const collectionsService = require('../services/collectionsService');
const AppError = require('../utils/errorUtils');

const checkCollectionOwnership = async (req, res, next) => {
    const userId = req.headers['user_id']
    const { id } = req.params; 

    if (!userId || !id) {
        return next(new AppError('User ID and Collection ID must be provided', 400));
    }

    try {
        await collectionsService.checkCollectionBelongsToUser(userId, id);

        next();
    } catch (error) {
        next(error); 
    }
};

module.exports = checkCollectionOwnership;

