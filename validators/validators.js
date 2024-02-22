const { validationResult } = require('express-validator');

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
            data: {},
        });
    }
    next();
}

module.exports = validator;