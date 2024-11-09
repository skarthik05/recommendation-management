const collectionsService = require('../services/collectionsService');
const AppError = require('../utils/errorUtils');

const checkCollectionName = async (req, res, next) => {
    const { userId, name } = req.body;

 

    try {

        const collectionExists = await collectionsService.checkCollectionNameExists(userId, name);

        if (collectionExists) {
            return next(new AppError(`Collection with name "${name}" already exists for this user.`, 400));
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = checkCollectionName;
