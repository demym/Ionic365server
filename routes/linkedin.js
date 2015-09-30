var express = require('express');
var router = express.Router();
var passport = require('passport');
var Linkedin = require('node-linkedin')('77m4gl9l7fgf9m', 'lhuq3lTGd7dOUWhZ', 'http://localhost:3000/ok');


/* GET items root resource. */
router.get('/', function(req, res){
  res.render('index', { user: req.user });
});

router.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

router.get('/login', function(req, res){
   	
  res.render('login', { user: req.user });
});

router.get('/failedlogin', function(req, res){
   	delete req.session.linkedin;
  res.send({ loggedin: false});
});

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
router.get('/auth', passport.authenticate('linkedin'),function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/callback',passport.authenticate('linkedin', { failureRedirect: '/failedlogin' }),function(req, res) {
	
	req.user.loggedin=true;
    req.user.loggedinwith="linkedin";
	req.session.linkedin=req.user;
	
	
	//res.send(req.user);
	
    res.redirect('/sociallogin');
  });

router.get('/logout', function(req, res){
  req.logout();
  //res.send(JSON.stringify(req.user))
  res.redirect("/sociallogin");
});

router.get('/test', function(req, res){
  res.send(JSON.stringify(req.user))
});


router.post('/lk', function(req, res){
	
	console.log(JSON.stringify(req.body))
 
 var atk=req.body.token;
 var atks=req.body.tokensecret;
 var url=req.body.url
 
 
 
 var incl_email=req.body.include_email;
 
 
 if (!url) url="statuses/home_timeline.json"
 
 
 

 console.log("posted to lk: "+atk+" - "+atks+" to API address: "+url);
 
 var linkedin = Linkedin.init(atk);

 linkedin.people.me(function(err, $in) {
    console.log($in)
});


});




function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}



module.exports = router;