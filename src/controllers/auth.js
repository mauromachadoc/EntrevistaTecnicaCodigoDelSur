const db = require('../helpers/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

async function registerUser(req, res, next) {
    try {
        const { email, firstName, lastName, password } = req.body;
        if (!email || !firstName || !lastName || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        const stmt = db.prepare(`
            INSERT INTO users (id, email, firstName, lastName, password)
            VALUES (?, ?, ?, ?, ?)
        `);
        stmt.run(userId, email, firstName, lastName, hashedPassword, function(err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT') {
                    return res.status(409).json({ message: 'Email already in use.' });
                }
                return next(err);
            }   
            res.status(201).json({ message: 'User registered successfully.', userId });
        });
        stmt.finalize();
    } catch (error) {   
        next(error);
    }
}

module.exports = { registerUser };


