const express = require('express');
const router = express.Router();
const {
    createCollection,
    addRecommendationToCollection,
    removeRecommendationFromCollection,
    getRecommendationsByCollectionId,
    deleteCollection,
    getCollectionByUserId,
} = require('../controllers/collectionsController');
const { validateCreateCollection } = require('../validations/collectionValidations');
const checkCollectionName = require('../middleware/checkCollectionName');
const validateCollectionAndRecommendation = require('../middleware/validateCollectionAndRecommendation');
const checkCollectionOwnership= require('../middleware/checkCollectionOwnership');
const checkUserExists = require('../middleware/checkUserExists');

router.get('/collections/', checkUserExists,getCollectionByUserId)
router.post('/collections', checkUserExists,validateCreateCollection, checkCollectionName, createCollection);
router.post('/collections/:id/recommendations', checkUserExists,validateCollectionAndRecommendation,addRecommendationToCollection);
router.delete('/collections/:id/recommendations/:recommendationId', checkUserExists,removeRecommendationFromCollection);
router.get('/collections/:id/recommendations',checkUserExists,checkCollectionOwnership,getRecommendationsByCollectionId);
router.delete('/collections/:id', checkUserExists,checkCollectionOwnership,deleteCollection);

module.exports = router;
