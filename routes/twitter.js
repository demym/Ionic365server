var express = require('express');
var router = express.Router();
var passport = require('passport');
var Twitter = require('twitter');

var TWITTER_CONSUMER_KEY = "Uzfi2kahegpKUHT2DOnVtY9OH";
var TWITTER_CONSUMER_SECRET = "lGsLNBEP9C9q6k4lW6o8BR6tro8EC1XEDSSfM3DyBSqDcc70qJ";

var OAuth= require('oauth').OAuth;

var oat="";
var oas="";
var oav="";

var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	 TWITTER_CONSUMER_KEY ,
	TWITTER_CONSUMER_SECRET,
	"1.0",
	"http://localhost:3000/twitter/oauth/callback",
	"HMAC-SHA1"
);

router.get("/callback2",function(req,res){
	
	
	res.send("LOGIN SUCCESSFULL")
	
	
	
})

router.get('/oauth', function(req, res){
	
	var cb=req.query.callbackurl;
	
	var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",	
	"https://api.twitter.com/oauth/access_token",
	 TWITTER_CONSUMER_KEY ,
	TWITTER_CONSUMER_SECRET,
	"1.0",
	cb,
	"HMAC-SHA1"
    );
	
	oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
		if (error) {
			console.log(error);
			res.send("yeah no. didn't work.")
		}
		else {
			//req.session.oauth = {};
			//req.session.oauth.token = oauth_token;
			console.log('oauth.token: ' + oauth_token);
			//req.session.oauth.token_secret = oauth_token_secret;
			console.log('oauth.token_secret: ' + oauth_token_secret);
			oat=oauth_token;
			oas=oauth_token_secret;
			var response={
				oauth_token: oauth_token,
				oauth_token_secret: oauth_token_secret
			}
			res.send(response)
			//res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
	}
	});
});


router.get('/oauth/access_token', function(req, res){
	
	var cb=req.query.callbackurl;
	var oat=req.query.oauth_token;
	var oats=req.query.oauth_token_secret;
	var oav=req.query.oauth_verifier;
	
	
	console.log("ACCESSTOJEN REQUEST: ")
	console.log(cb)
	console.log(oat)
	console.log(oats)
	console.log(oav)
	
	var oa = new OAuth(
	"https://api.twitter.com/oauth/request_token",
	"https://api.twitter.com/oauth/access_token",
	 TWITTER_CONSUMER_KEY ,
	TWITTER_CONSUMER_SECRET,
	"1.0",
	cb,
	"HMAC-SHA1"
    );
	
		oa.getOAuthAccessToken(oat,oats,oav, 
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send("yeah something broke.");
			} else {
				//req.session.oauth.access_token = oauth_access_token;
				//req.session.oauth,access_token_secret = oauth_access_token_secret;
				results.access_token=oauth_access_token;
				results.access_token_secret=oauth_access_token_secret;
				console.log("login results: "+JSON.stringify(results));
				res.send(results);
			}
		}
		);
	
});


router.get('/oauth/callback', function(req, res, next){
	
	var oatoken=req.query.oauth_token;
	var oav=req.query.oauth_verifier;
	
	


		oa.getOAuthAccessToken(oat,oas,oav, 
		function(error, oauth_access_token, oauth_access_token_secret, results){
			if (error){
				console.log(error);
				res.send("yeah something broke.");
			} else {
				//req.session.oauth.access_token = oauth_access_token;
				//req.session.oauth,access_token_secret = oauth_access_token_secret;
				console.log(results);
				res.send("worked. nice one.");
			}
		}
		);
	
});

/* GET items root resource. */
router.get('/', function(req, res){
  res.render('index', { user: req.user });
});


router.post('/tw', function(req, res){
 
 

 var atk=req.body.token;
 var atks=req.body.tokensecret;
 var url=req.body.url
 var incl_email=req.body.include_email;
 
 console.log(url);
 
 if (!url) url="statuses/home_timeline.json"

 console.log("posted to tw: "+atk+" - "+atks+" to API address: "+url);
 
var client = new Twitter({
  consumer_key: 'Uzfi2kahegpKUHT2DOnVtY9OH',
  consumer_secret: 'lGsLNBEP9C9q6k4lW6o8BR6tro8EC1XEDSSfM3DyBSqDcc70qJ',
 /* saccess_token_key: '3346427337-oBtb44QexY5HAvAF20uvl628U3AR8D8SjIedCE0',
  saccess_token_secret: 'HNDojoRjwGfYKkpsTwRGZfwYaxVOVdHDXYUCiKyU9AnBV',*/
  access_token_key: atk,
  access_token_secret: atks
});

if (incl_email) client.include_email=true;
 

 
client.get(url, function(error, tweets, response){
  if(error){
	  console.log("error: "+JSON.stringify(error))
	  res.send(error);
	  return;
  }  
  //console.log(tweets);  // The favorites. 
 // console.log(response);  // Raw response object. 
  res.send(tweets)
});

});




router.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

router.get('/login', function(req, res){
	
 console.log(req);	
   	
  res.render('login', { user: req.user });
});

router.get('/login2', function(req, res){
	
	
	var https = require('https');
    var request=require("request")
	/*
var options = {
  host: 'api.twitter.com',
  port: 443,
  path: '/oauth/request_token',
  method: 'POST'
};

var req = https.request(options, function(res) {
  console.log(res.statusCode);
  res.on('data', function(d) {
    process.stdout.write(d);
  });
});
req.end();

req.on('error', function(e) {
  console.error(e);
});


return;
	*/

 
 request.post(
    'http://api.twitter.com/oauth/request_token',
    { form: { key: 'value' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        } 
		if (error) console.log("error:"+error.message)
			if (!error) console.log(body)
    }
);
 
 

   	
  res.send('ok');
});


router.get('/failedlogin', function(req, res){
   	
  delete req.session.twitter;	
  res.send({ loggedin: false});
});

// GET /auth/facebook
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Facebook authentication will involve
//   redirecting the user to facebook.com.  After authorization, Facebook will
//   redirect the user back to this application at /auth/facebook/callback
router.get('/auth', passport.authenticate('twitter'),function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
  });

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/callback',passport.authenticate('twitter', { failureRedirect: '/failedlogin' }),function(req, res) {
	
	
	var ot=req.query.oauth_token;
	var ov=req.query.oauth_verifier;
	
	req.session.twitter=req.user;
	
	req.user.loggedin=true;
    req.user.loggedinwith="twitter";
	console.log("OT: "+ot+" - OV: " + ov);
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





function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}



module.exports = router;