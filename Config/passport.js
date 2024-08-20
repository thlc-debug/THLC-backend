const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/User'); 

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://thlc-backend.vercel.app/api/auth/google/callback',
},
async (token, tokenSecret, profile, done) => {
  
  try {
    const password = Array.from({length: 12}, () => Math.random().toString(36)[2]).join('');
    let user = await User.findOne({ mail: profile.emails[0].value });
    // console.log("___________________________");
    // // console.log(profile)
    // console.log("___________________________");
    
    if (!user) {
      user = new User({
        username: profile.displayName,
        mail: profile.emails[0].value,
        password: password,
        accountType: 'guest',
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.mail);
});

passport.deserializeUser(async (mail, done) => {
  try {
    const user = await User.findOne({ mail });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;