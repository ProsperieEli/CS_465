const mongoose = require('mongoose');
const User = mongoose.model('User');
const passport = require('passport');


const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({
            message: 'All fields required'
        });
    }

    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email
        });

        user.setPassword(req.body.password);
        await user.save();

        const token = user.generateJWT();

        return res.status(201).json({ token });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: 'Email already registered'
            });
        }

        return res.status(500).json({
            message: 'Unable to register user'
        });
    }
};

const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({
            message: 'All fields required'
        });
    }

    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({
                message: 'Unable to log in'
            });
        }

        if (!user) {
            return res.status(401).json(info);
        }

        const token = user.generateJWT();
        return res.status(200).json({ token });
    })(req, res);
};

module.exports = {
    register,
    login
};