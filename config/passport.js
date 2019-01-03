const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const log = require('./winston');

const User = require('../models/User');

module.exports = (passport) => {
  passport.use(
      // eslint-disable-next-line max-len
      new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
        User.findOne({username: username})
            .then((user) => {
              if (!user) {
                return done(null, false,
                    {message: 'This username is not registered'});
              }
              bcrypt.compare(password, user.password, (err, isMatch) => {
                log.error(err);
                if (isMatch) {
                  return done(null, user);
                } else {
                  return done(null, false, {message: 'Password Incorrect'});
                }
              });
            })
            .catch((err) => log.error(err));
      })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
