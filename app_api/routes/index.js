const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Authorization header required'
        });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            message: 'Bearer token required'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid or expired token'
            });
        }

        req.auth = decoded;
        next();
    });
}

router.route('/trips')
    .get(tripsController.tripsList)
    .post(authenticateJWT, tripsController.tripsAddtrip);

router.route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip);

router.route('/register')
    .post(authController.register);

router.route('/login')
    .post(authController.login);


module.exports = router;