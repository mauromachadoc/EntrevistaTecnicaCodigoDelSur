const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'movies.db');
const db = new sqlite3.Database(dbPath);

// Habilitar foreign keys (están deshabilitadas por defecto en SQLite)
db.run('PRAGMA foreign_keys = ON');

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
            adult INTEGER DEFAULT 0,
            backdrop_path TEXT,
            genre_ids TEXT,
            original_language TEXT,
            original_title TEXT,
            overview TEXT,
            popularity REAL,
            poster_path TEXT,
            release_date TEXT,
            title TEXT NOT NULL,
            video INTEGER DEFAULT 0,
            vote_average REAL,
            vote_count INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
            movieId INTEGER NOT NULL,
            userId TEXT NOT NULL,
            addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (movieId, userId),
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE
        )
    `);


    db.run(`
        CREATE TABLE IF NOT EXISTS jwt_blacklist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT UNIQUE NOT NULL,
            blacklisted_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    console.log('Database initialized successfully');
});

module.exports = db;
