const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const db = require('./database');


function authenticate(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    };

    db.get('SELECT * FROM jwt_blacklist WHERE token = ?', [token], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (row) {
            return res.status(401).json({ message: 'Token is blacklisted' });
        }
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            // console.log('Decoded JWT:', decoded);
            req.user = decoded;
            next();
        });
    });
}

module.exports = { authenticate };
