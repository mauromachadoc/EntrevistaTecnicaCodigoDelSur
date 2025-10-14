const express = require('express');
const { body } = require('express-validator');
const { addFavoriteMovie, getFavoriteMovies } = require('../controllers/favorite');

const router = express.Router();

router.post('/favorites', [
    body('movieId').isString().withMessage('movieId must be a string.')
], addFavoriteMovie);

router.get('/favorites', getFavoriteMovies);

module.exports = router;