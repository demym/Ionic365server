var express = require('express');
var router = express.Router();
var passport = require('passport');
var dbs=require("../routes/dbs");
var fbToken="";	


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
   	delete req.session.facebook;
  res.send({ loggedin: false});
});

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
router.get('/auth', passport.authenticate('facebook'),function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
	
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/callback',passport.authenticate('facebook', { failureRedirect: '/failedlogin' }),function(req, res) {
	console.log("callback sessionID_ "+req.sessionID);
	req.user.loggedin=true;
	req.user.loggedinwith="facebook";
	req.session.facebook=req.user;
	//req.sessionId="bravoguaglione"
	//console.log("sessionId: "+req.sessionId)
	console.log(JSON.stringify(req.user));
	
	console.log("TOKEN: "+req.query.code)
	fbToken=req.query.code;
	
	var doc={};
	console.log("sessionId: "+req.query.sessionId);
	req.session.sessionid=req.query.sessionId;
	
	doc.session=req.session;
	doc.session.sessionid=req.query.sessionId;
	
	doc.facebook_user=req.user;
	doc.facebook_user.auth_token=fbToken;
	dbs.insert("sessions",doc,function(data){
		
		console.log("session inserted "+JSON.stringify(data))
		
	})
	
	/*
	dbs.listByField("users","sessionid",req.sessionID,function(data){
		
		console.log("listbyfield: "+JSON.stringify(data))
	})
	*/


	
	//res.send(req.user);
	
    res.redirect('/sociallogin?access_token='+fbToken);
  });

router.get('/logout', function(req, res){
  req.logout();
  //res.send(JSON.stringify(req.user))
  res.redirect("/sociallogin");
});

router.get('/test', function(req, res){
  console.log("sessionId: "+req.sessionID);
  res.send(JSON.stringify(req.user))
});


router.get('/session/:sid', function(req, res){
  var sid=req.params.sid;	
  
  console.log("sessionId: "+req.sessionID);
  console.log("sid: "+sid);
  res.send(JSON.stringify(req.user))
});

router.get('/getsessionid', function(req, res){
  res.send(JSON.stringify(req.sessionID))
});



router.get("/testfb",function(req,res){
	

var facebook = require('./fb');

    facebook.get(fbToken, '/me/friends', function(data){
       console.log(data);
   });

   res.send("braf")

});



function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}



module.exports = router;