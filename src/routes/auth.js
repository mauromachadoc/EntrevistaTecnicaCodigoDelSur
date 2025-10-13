const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/auth');

const router = express.Router();

router.post('/auth/register', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('firstName').notEmpty().withMessage('First name is required').escape(),
    body('lastName').notEmpty().withMessage('Last name is required').escape(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password').matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter'),
    body('password').matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
    body('password').matches(/[0-9]/).withMessage('Password must contain at least one number'),
    body('password').matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character'),
], registerUser);

router.post('/auth/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
], loginUser);

module.exports = router;