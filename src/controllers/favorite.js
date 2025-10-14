const TMDB_KEY = process.env.TMDB_KEY;
const db = require('../helpers/database');
const axios = require('axios');

async function addFavoriteMovie(req, res, next) {
    try {
        const userId = req.user.id;
        const {movieId} = req.body;
        if (!movieId) {
            return res.status(400).json({ message: 'movieId is required.' });
        }

        
        const movieAlreadyInDB = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM movies WHERE id = ?', [movieId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!movieAlreadyInDB) {
            const config = {
                headers: {
                    'Authorization': `Bearer ${TMDB_KEY}`,
                    'accept': 'application/json'
                }
            };

            const response = await axios.get(
                `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
                config
            );

            const movie = response.data;

            const insertMovieStmt = db.prepare(`
                INSERT OR IGNORE INTO movies (id, adult, backdrop_path, genre_ids, original_language, original_title, overview, popularity, poster_path, release_date, title, video, vote_average, vote_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            insertMovieStmt.run(movie.id, movie.adult ? 1 : 0, movie.backdrop_path, JSON.stringify(movie.genre_ids), movie.original_language, movie.original_title, movie.overview, movie.popularity, movie.poster_path, movie.release_date, movie.title, movie.video ? 1 : 0, movie.vote_average, movie.vote_count);
            insertMovieStmt.finalize();
        }

        const insertFavoriteStmt = db.prepare(`
            INSERT INTO favorites (movieId, userId)
            VALUES (?, ?)
        `);
        insertFavoriteStmt.run(movieId, userId, function(err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(409).json({ message: 'Movie already in favorites.' });
                }
                return next(err);
            }
            res.status(201).json({ message: 'Movie added to favorites.' });
        });
        insertFavoriteStmt.finalize();
    } catch (error) {
        next(error);
    } 
}

async function getFavoriteMovies(req, res, next) {
    try {
        const userId = req.user.id;
        const favoriteMovies = await new Promise((resolve, reject) => {
            db.all(`
            SELECT m.*
            FROM movies m
            JOIN favorites f ON m.id = f.movieId
            WHERE f.userId = ?
            `, [userId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
            });
        });

        console.log(favoriteMovies);

        const scoredMovies = favoriteMovies
            .map(movie => ({
            ...movie,
            suggestionForTodayScore: Math.floor(Math.random() * 100)
        }))
            .sort((a, b) => b.suggestionForTodayScore - a.suggestionForTodayScore);

        res.status(200).json(scoredMovies);
    } catch (error) {
        next(error);
    }
}

module.exports = { addFavoriteMovie, getFavoriteMovies };
