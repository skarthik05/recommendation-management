const pool = require('../db/db');
const AppError = require('../utils/errorUtils');

const getCollectionByUserId = async (userId) => {
    try {
        const result = await pool.query('SELECT * FROM collections WHERE user_id = $1', [userId]);
        if (result.rowCount === 0) {
            throw new AppError(`No collections found for user with ID ${userId}`, 404);
        }
        return result.rows;
    } catch (error) {
        console.error('Error in getCollectionByUserId:', error);
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to fetch collections', 500);
    }
};

const createCollection = async (userId, name, description) => {
    try {
        const result = await pool.query(
            'INSERT INTO collections (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
            [userId, name, description]
        );
        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') {
            throw new AppError(`Collection with name "${name}" already exists for this user.`, 400);
        }
        console.error('Error in createCollection:', error);
        throw new AppError('Failed to create collection', 500);
    }
};

const addRecommendationToCollection = async (collectionId, recommendationId) => {
    try {
        const checkOwnership = await pool.query(
            'SELECT * FROM recommendations WHERE id = $1 AND user_id = (SELECT user_id FROM collections WHERE id = $2)',
            [recommendationId, collectionId]
        );
        if (checkOwnership.rowCount === 0) {
            throw new AppError('Recommendation does not belong to this user or collection does not exist.', 403);
        }

        const result = await pool.query(
            'INSERT INTO collection_recommendations (collection_id, recommendation_id) VALUES ($1, $2) RETURNING *',
            [collectionId, recommendationId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error in addRecommendationToCollection:', error);
        if (error instanceof AppError) throw error;
        throw new AppError('Failed to add recommendation to collection', 500);
    }
};

const removeRecommendationFromCollection = async (collectionId, recommendationId) => {
    try {
        await pool.query(
            'DELETE FROM collection_recommendations WHERE collection_id = $1 AND recommendation_id = $2',
            [collectionId, recommendationId]
        );
    } catch (error) {
        console.error('Error in removeRecommendationFromCollection:', error);
        throw new AppError('Failed to remove recommendation from collection', 500);
    }
};

const getRecommendationsByCollectionId = async (collectionId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    try {
        const countResult = await pool.query(
            `SELECT COUNT(*) FROM collection_recommendations WHERE collection_id = $1`,
            [collectionId]
        );
        const totalRecommendations = parseInt(countResult.rows[0].count, 10);
        const totalPages = Math.ceil(totalRecommendations / limit);

        const result = await pool.query(
            `SELECT recommendations.* FROM recommendations
             JOIN collection_recommendations
             ON recommendations.id = collection_recommendations.recommendation_id
             WHERE collection_recommendations.collection_id = $1
             LIMIT $2 OFFSET $3`,
            [collectionId, limit, offset]
        );

        return {
            page,
            limit,
            totalPages,
            totalRecommendations,
            recommendations: result.rows,
        };
    } catch (error) {
        console.error('Error in getRecommendationsByCollectionId:', error);
        throw new AppError('Failed to retrieve recommendations for the collection', 500);
    }
};

const deleteCollection = async (collectionId) => {
    try {
        await pool.query('DELETE FROM collections WHERE id = $1', [collectionId]);
    } catch (error) {
        console.error('Error in deleteCollection:', error);
        throw new AppError('Failed to delete collection', 500);
    }
};

const checkCollectionNameExists = async (userId, name) => {
    try {
        const result = await pool.query(
            'SELECT * FROM collections WHERE user_id = $1 AND name = $2',
            [userId, name]
        );
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error in checkCollectionNameExists:', error);
        throw new AppError('Database error while checking collection name.', 500);
    }
};

const checkCollectionBelongsToUser = async (userId, collectionId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM collections WHERE user_id = $1 AND id = $2',
            [userId, collectionId]
        );
        if (result.rowCount === 0) {
            throw new AppError(`Collection with ID ${collectionId} does not belong to user with ID ${userId}`, 404);
        }
        return true;
    } catch (error) {
        console.error('Error in checkCollectionBelongsToUser:', error);
        if (error instanceof AppError) throw error;
        throw new AppError('Error checking collection ownership', 500);
    }
};

const checkRecommendationBelongsToUser = async (userId, recommendationId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM recommendations WHERE user_id = $1 AND id = $2',
            [userId, recommendationId]
        );
        if (result.rowCount === 0) {
            throw new AppError(`Recommendation with ID ${recommendationId} does not belong to user with ID ${userId}`, 404);
        }
        return true;
    } catch (error) {
        console.error('Error in checkRecommendationBelongsToUser:', error);
        if (error instanceof AppError) throw error;
        throw new AppError('Error checking recommendation ownership', 500);
    }
};

const checkRecommendationInCollection = async (collectionId, recommendationId) => {
    try {
        const result = await pool.query(
            'SELECT * FROM collection_recommendations WHERE collection_id = $1 AND recommendation_id = $2',
            [collectionId, recommendationId]
        );
        if (result.rowCount > 0) {
            throw new AppError(`Recommendation with ID ${recommendationId} already exists in the collection`, 400);
        }
        return true;
    } catch (error) {
        console.error('Error in checkRecommendationInCollection:', error);
        if (error instanceof AppError) throw error;
        throw new AppError('Error checking recommendation existence in collection', 500);
    }
};

const validateCollectionAndRecommendation = async (userId, collectionId, recommendationId) => {
    await checkCollectionBelongsToUser(userId, collectionId);
    await checkRecommendationBelongsToUser(userId, recommendationId);
    await checkRecommendationInCollection(collectionId, recommendationId);
    return true;
};

module.exports = {
    createCollection,
    addRecommendationToCollection,
    removeRecommendationFromCollection,
    getRecommendationsByCollectionId,
    deleteCollection,
    getCollectionByUserId,
    checkCollectionNameExists,
    validateCollectionAndRecommendation,
    checkCollectionBelongsToUser,
};
