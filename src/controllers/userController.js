const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const keySecret = process.env.STRIPE_SECRET_KEY
const keyPublishable = process.env.STRIPE_PUBLISHABLE_KEY
const stripe = require('stripe')(keySecret);

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
  },
  profile(req, res, next) {
    userQueries.getUser(req.params.id, (err, user) => {
      if (err || user == null) {
        req.flash('notice', 'No user found with that ID.')
        res.redirect('/')
      } else {
        res.render('users/profile', {user})
      }
    })
  },
  checkout(req, res, next) {
    res.render('users/checkout')
  },
  upgradeAccount(req, res, next) {
    console.log('Stripe token received: ', req.body)

    const token = req.body.stripeToken

    stripe.charges.create({
      amount: 1500,
      currency:'usd',
      description:'blocipedia upgrade',
      source: token
    })
    .then((charge) => {
      if(req.user.role === 0){
      userQueries.upgradeUser(req, (err, user) => {
        if (err) {
          req.flash('error', err);
          res.redirect('/');
        } else {
          req.flash('notice', 'payment successful')
          res.redirect('/')
        }
      })
    } else {
      req.flash('notice', "You are already a premium member");
      res.redirect('/');
    }
    })

  },
  downgradeAccount(req, res, next) {
    if(req.user.role === 1) {
      userQueries.downgradeUser(req, (err, user) => {
        if(err) {
          // console.error(err.toString());
          req.flash('error', err)
          res.redirect('/')
        } else {
          userQueries.makePublic(req.user, (err) => {
            if (err) {
              // console.error(err.toString());
              req.flash('error', err);
              res.redirect('/'); 
            } else {
              res.redirect("/");
            }
          })
          req.flash('notice', 'downgrade successful')
          res.redirect('/')
        }
      })
    } else {
      req.flash('notice', 'You are already a standard user')
      res.redirect('/')
    }
  },
  makeAdmin(req, res, next) {
    if(req.user.role !== 2) {
      userQueries.makeAdmin(req, (err, user) => {
        if(err) {
          req.flash('error', err)
          res.redirect('/')
        } else {
          req.flash('notice', `${req.user.name} (${req.user.email}) is now an administrator.`)
          res.redirect('/')
        }
      })
    }
  },
  removeAdmin(req, res, next) {
    if(req.user.role === 2) {
      userQueries.downgradeUser(req, (err, user) => {
        if(err) {
          req.flash('error', err)
          res.redirect('/')
        } else {
          req.flash('notice', `${req.user.name} (${req.user.email}) no longer has admin privileges.`)
          res.redirect('/')
        }
      })
    }
  },
  // FIXME: rename method below to collaborator list or something like that
  index(req, res, next) {
    userQueries.getAllUsers((err, users) => {
      if(err) {
        res.redirect(404, '/')
      } else {
        res.render('users/index', {users})
      }
    })
  }
}