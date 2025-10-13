const express = require('express');
const { getMoviesFromTMDB } = require('../controllers/movie');
const { query } = require('express-validator');

const router = express.Router();


router.get('/', [
    query('search')
        .optional()
        .isString()
        .withMessage('Search query must be a string')
        .escape()
], getMoviesFromTMDB);

module.exports = router;