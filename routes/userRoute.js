const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

router.route('/signup').post([
    body('name').not().isEmpty().withMessage('Please enter your name'),
    body('email').isEmail().withMessage('Please enter a valid email')
    .custom((userEmail) => {
        return User.findOne({email:userEmail}).then(user => {
            if(user){
                return Promise.reject('Email is already exists')
            }
        })
    }),
    body('password').not().isEmpty().withMessage('Please enter a password'),
    // body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

], authController.createUser);
router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage);

module.exports = router;
