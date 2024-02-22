const { param, body } = require('express-validator');
const { validator } = require('./validators');

const register = [
    // body('username').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    // body('email').isEmail().withMessage('Email is not valid'),
    // body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    validator
]

const login = [
    // body('username').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    // body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    validator
]

module.exports = {
    register,
    login
}