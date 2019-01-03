const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../../models/User');
const log = require('../../config/winston');

const userController = {};

userController.get_login = (req, res) => {
  res.render('auth/login', {
    csrfToken: req.csrfToken(),

  });
};

userController.get_register = (req, res) => {
  res.render('auth/register', {
    csrfToken: req.csrfToken(),

  });
};

userController.post_register = (req, res) => {
  const {fname, lname, username, email, password, password2} = req.body;
  const errors = [];

  if (!fname || !lname || !username || !email || !password || !password2) {
    errors.push({msg: 'please fill all the fields'});
  }

  if (password !== password2) {
    errors.push({msg: 'passwords do not match'});
  }
  if (password.length < 1) {
    errors.push({msg: 'passwords should at least 6 characters'});
  }

  if (errors.length > 0) {
    res.render('auth/register', {
      errors,
      csrfToken: req.csrfToken(),
      fname,
      lname,
      username,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({username: username})
        .then((user) => {
          if (user) {
            errors.push({
              msg: 'Username already exists',
            });
            res.render('auth/register', {
              errors,
              csrfToken: req.csrfToken(),
              fname,
              lname,
              username,
              email,
              password,
              password2,
            });
          } else {
            const newUser = new User({
              fname,
              lname,
              username,
              email,
              password,
            });

            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then((user) => {
                      req.flash('success_msg',
                          'You are now registered and can log in'
                      );
                      res.redirect('/users/login');
                    })
                    .catch((err) => log.error(err));
              });
            });
          }
        });
  }
};

userController.post_login = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next);
};

userController.logout = (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
};

module.exports = userController;
