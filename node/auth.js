function setupAuth(User, app) {
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser(function(user, done) {
    done(null, user.username);
  });

  passport.deserializeUser(function(id, done) {
    User.
      findOne({ username : username }).
      exec(done);
  });

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.verifyPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

  // Express middlewares
  app.use(require('express-session')({
    secret: 'open research'
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Express routes for auth
  app.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });
}

module.exports = setupAuth;
