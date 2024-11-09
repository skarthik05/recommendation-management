const collectionsService = require('../services/collectionsService');
const AppError = require('../utils/errorUtils');

const validateCollectionAndRecommendation = async (req, res, next) => {
    const { recommendationId } = req.body;
    const { id } = req.params;
    const userId = req.headers['user_id']
    if (!userId || !id || !recommendationId) {
        return next(new AppError('userId, collectionId, and recommendationId are required', 400));
    }

    try {
        await collectionsService.validateCollectionAndRecommendation(userId, id, recommendationId);
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateCollectionAndRecommendation;
