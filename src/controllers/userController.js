const userQueries = require("../db/queries.users.js");
const passport = require("passport");

module.exports = {
  signUpForm(req, res, next) {
    res.render('users/signup')
  },
  signUp(req, res, next) {
    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.password_conf
    };
    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/signup");
      } else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        })
      }
    });
  },
  signInForm(req, res, next) {
    res.render('users/sign_in')
  },
  signIn(req, res, next){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) {
        req.flash('notice', 'Sign in failed. Please try again.')
        res.redirect('/users/sign_in')
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        req.flash('notice', "You've successfully signed in!");
        res.redirect('/');
      });
    }) (req, res, next);
  },
  signOut(req, res, next){
    req.logout();
    req.flash('notice', "You've successfully signed out!");
    res.redirect('/');
  }

}