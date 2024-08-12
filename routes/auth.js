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
const passport = require('../Config/passport');

// Register route
router.post('/signup', signupController.registerUser);

// Login route
router.post('/login', loginController.login);

// Sign In with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/failure' }),
    (req, res) => {
      const token = req.user.generateAuthToken(); // Generate JWT token for the user
      res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Auth Screen</title></head>
      <body>
        <script>
            if (window.opener) {
              window.opener.postMessage(${JSON.stringify({
                token:token,
              })}, '*');
            }
            window.close();
        </script>
      </body>
      </html>
    `);
    }
  );

  router.get('/failure', (req, res) => {
    res.send('Failed to authenticate..');
  });


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
