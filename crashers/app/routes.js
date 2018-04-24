module.exports = function(app, passport, db, ObjectId) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function(req, res) {
    db.collection('crash').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('index.ejs', {
        crash: result
      })
    })
  });

  // app.get('/profile', function(req, res) {
  //   db.collection('crash').find().toArray((err, result) => {
  //     if (err) return console.log(err)
  //     res.render('profile.ejs', {
  //       crash: result
  //     })
  //   })
  // });

  // app.get('/posting/:id', function(req, res) {
  //   uId = ObjectId(req.params.id)
  //   db.collection('crash').findOne({
  //     "_id": uId
  //   }, (err, result) => {
  //     if (err) return console.log(err)
  //     res.render('ad-post.ejs', {
  //       crash: result
  //     })
  //   })
  // });



  // PROFILE SECTION
  app.get('/profile', isLoggedIn, function(req, res) {
    db.collection('crash').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        crash: result
      })
    })
  });



  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // crash board routes ===============================================================

  app.post('/crash', (req, res) => {
    db.collection('crash').save({
      title: req.body.title,
      location: req.body.location,
      url: req.body.url,
      time: req.body.time,
      date: req.body.date,
      description: req.body.description,
      group: req.body.optradio
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/')
    })
  })


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function(req, res) {
    res.render('login.ejs', {


      crash: req.flash('logincrash')

    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash crashs
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function(req, res) {
    res.render('signup.ejs', {
      crash: req.flash('signupMessage')
    });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash crashs
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function(req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function(err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
