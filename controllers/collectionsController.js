const { validationResult } = require('express-validator');
const collectionsService = require('../services/collectionsService');
const { sendResponse } = require('../utils/responseUtils');

const getCollectionByUserId = async (req, res, next) => {
    try {
        const userId = req.headers['user_id'];
        const collections = await collectionsService.getCollectionByUserId(userId);
        sendResponse(res, collections, 200)
    } catch (error) {
        next(error)
    }
}

const createCollection = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next(errors)
    }
    const userId = req.headers['user_id']
    const { name, description } = req.body;
    try {
        const collection = await collectionsService.createCollection(userId, name, description);
        sendResponse(res, collection, 201)
    } catch (error) {
        next(error)
    }
};

const addRecommendationToCollection = async (req, res, next) => {
    const collectionId = req.params.id;
    const { recommendationId } = req.body;
    try {
        const recommendation = await collectionsService.addRecommendationToCollection(collectionId, recommendationId);
        sendResponse(res, recommendation, 201)
    } catch (error) {
        next(error)
    }
};

const removeRecommendationFromCollection = async (req, res, next) => {
    const collectionId = req.params.id;
    const recommendationId = req.params.recommendationId;
    try {
        await collectionsService.removeRecommendationFromCollection(collectionId, recommendationId);
        sendResponse(res, {}, 204)
    } catch (error) {
        next(error)
    }
};

const getRecommendationsByCollectionId = async (req, res, next) => {
    const collectionId = req.params.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const data = await collectionsService.getRecommendationsByCollectionId(collectionId, page, limit);
        sendResponse(res, data, 200)
    } catch (error) {
        next(error)
    }
};

const deleteCollection = async (req, res, next) => {
    const collectionId = req.params.id;
    try {
        await collectionsService.deleteCollection(collectionId);
        sendResponse(res, {}, 204)
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getCollectionByUserId,
    createCollection,
    addRecommendationToCollection,
    removeRecommendationFromCollection,
    getRecommendationsByCollectionId,
    deleteCollection,
};
