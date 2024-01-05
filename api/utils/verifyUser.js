const ErrorHandler = require('./ErrorHandler.js')
const jwt = require('jsonwebtoken')

const verifyUser = async (req, res, next) => {
    const token = req.cookies.sadfnkandsi23;

    if (!token) return next(ErrorHandler(401, 'Unauthorized'))

    jwt.verify(token, process.env.JSON_WEB_TOKEN, (error, user) => {
        if (error) {
            return next(ErrorHandler(401, 'Invalid token'));
        }

        req.user = user;
        next()
    })
}

module.exports = verifyUser