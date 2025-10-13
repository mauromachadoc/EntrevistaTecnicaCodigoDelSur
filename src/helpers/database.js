const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'movies.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);


    db.run(`
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY,
            backdrop_path TEXT,
            title TEXT NOT NULL,
            original_title TEXT,
            overview TEXT,
            poster_path TEXT,
            media_type TEXT,
            adult INTEGER DEFAULT 0,
            original_language TEXT,
            popularity REAL,
            release_date TEXT,
            video INTEGER DEFAULT 0,
            vote_average REAL,
            vote_count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
            id TEXT PRIMARY KEY,
            movieId INTEGER NOT NULL,
            userId TEXT NOT NULL,
            addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE,
            UNIQUE(movieId, userId)
        )
    `);


    db.run(`
        CREATE TABLE IF NOT EXISTS jwt_blacklist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT UNIQUE NOT NULL,
            userId TEXT NOT NULL,
            blacklisted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            expires_at DATETIME NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    console.log('Database initialized successfully');
});

module.exports = db;
