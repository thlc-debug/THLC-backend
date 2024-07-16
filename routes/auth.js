const express = require('express');
const router = express.Router();
const signupController = require('../controllers/signupController');
const loginController = require('../controllers/loginController');
const logoutController = require('../controllers/logoutController');
const otpController = require('../controllers/otpController');
const passwordResetOtpController = require('../controllers/passwordResetOtpController');
const passwordResetController = require('../controllers/passwordResetController');
const activeUsersController = require('../controllers/activeUserController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

// Register route
router.post('/signup', [
  check('username').not().isEmpty().withMessage('Username is required'),
  check('mail').isEmail().withMessage('Valid email is required'),
  check('phone').not().isEmpty().withMessage('Phone number is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('otp').not().isEmpty().withMessage('OTP is required')
], signupController.register);

// Login route
router.post('/login', loginController.login);

// Logout route
router.post('/logout', logoutController.logout);

// Fetch logged-in user details
router.get('/active-users', activeUsersController.getActiveUsers);

// Send OTP route for registration
router.post('/send-otp', [
  check('mail').isEmail().withMessage('Valid email is required'),
], otpController.sendOtp);

// Send OTP route for password reset
router.post('/request-password-reset', [
  check('mail').isEmail().withMessage('Valid email is required'),
], passwordResetOtpController.sendResetOtp);

// Reset password route
router.post('/reset-password', [
  check('mail').isEmail().withMessage('Valid email is required'),
  check('otp').not().isEmpty().withMessage('OTP is required'),
  check('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], passwordResetController.resetPassword);

module.exports = router;
