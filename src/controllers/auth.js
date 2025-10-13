const db = require('../helpers/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

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

async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email, jti: uuidv4() }, 
            JWT_SECRET, 
            { expiresIn: '48h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token
        });
        
    } catch (error) {
        next(error);
    }
}

module.exports = { registerUser, loginUser };


