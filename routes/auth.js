const express           = require("express"),
      router            = express.Router(),
      passport          = require("passport");

const db = require("../models");

const async       = require("async"),
      nodemailer  = require("nodemailer"),
      crypto      = require("crypto");

// REGISTER ROUTES
router.get("/register", checkAdmin, function (req, res) {
  res.render("main/register");
});

router.post("/register", function (req, res) {
  req.body.username = req.sanitize(req.body.username);
  req.body.email = req.sanitize(req.body.email);
  req.body.adminCode = req.sanitize(req.body.adminCode);

  let newUser = new db.User({
    username: req.body.username,
    email: req.body.email
  });
  if (req.body.adminCode === "root") {
    newUser.isAdmin = true;
  }
  if (req.body.password === req.body.confirm) {
    db.User.register(newUser, req.body.password, function (err, user) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        passport.authenticate("local")(req, res, function () {
          req.flash("success", `Successfully registered as ${req.user.username} from ${req.user.email}`);
          res.redirect("/ingots");
        });
      }
    });
  } else {
    req.flash("error", "Password do not match");
    res.redirect("back");
  }
});

// LOGIN ROUTES
router.get("/login", function (req, res) {
  res.render("main/login");
});

router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/ingots",
    failureRedirect: "/auth/login",
    failureFlash: true,
    successFlash: `Welcome!`
  }), function (req, res) {
  });

// LOGOUT ROUTES
router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "Logged Out Successfully");
  res.redirect("/ingots");
});

// FORGOT PASSWORD ROUTES
router.get("/forgot", function (req, res) {
  res.render("main/forgot");
});

router.post('/forgot', function (req, res, next) {
  req.body.email = req.sanitize(req.body.email);
  
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
        // When it is done, the token generated will be sent as part of the URL to the user email
      });
    },
    function (token, done) {
      db.User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/auth/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 900000; // 15 minutes

        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: '172.16.1.3'
      });
      var mailOptions = {
        to: user.email,
        from: 'nodejsGrinding@sehmy.com',
        subject: 'Wafer Monitoring System Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/auth/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n' +
          'This is an auto-generated email. Please do not reply to this email.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        console.log('Mail Sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('/auth/forgot');
  });
});

// PASSWORD RESET TOKEN ROUTE
router.get('/reset/:token', function (req, res) {
  db.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/auth/forgot');
    }
    res.render('main/reset', { token: req.params.token });
  });
});

router.post('/reset/:token', function (req, res) {
  async.waterfall([
    function (done) {
      db.User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if (req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
              req.logIn(user, function (err) {
                done(err, user);
              });
            });
          });
        } else {
          req.flash("error", "Password do not match.");
          return res.redirect('back');
        }
      });
    },
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: '172.16.1.3'
      });
      var mailOptions = {
        to: user.email,
        from: 'nodejsGrinding@sehmy.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function (err) {
    res.redirect('/ingots');
  });
});

function checkAdmin(req, res, next) {
  // Check to see if database contain admin as user or not
  db.User.findOne({ username: 'admin' })
    .then((user) => {
      // If there are  none, go proceed to the register route
      if (user === null) {
        return next();
      } else {
        // There is a user and the user is an admin
        if (req.isAuthenticated() && req.user.isAdmin) {
          return next();
        } else {
            req.flash("error", "You do not have administrator privilege to do that!");
            res.redirect("/auth/login");
          }
        }
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = router;