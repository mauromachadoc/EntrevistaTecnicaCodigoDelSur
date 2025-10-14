const express = require('express');
const { body } = require('express-validator');
const { addFavoriteMovie, getFavoriteMovies } = require('../controllers/favorite');

const router = express.Router();

router.post('/favorites', [
    body('movieId').isNumeric().withMessage('movieId must be a number.')
], addFavoriteMovie);

router.get('/favorites', getFavoriteMovies);

module.exports = router;