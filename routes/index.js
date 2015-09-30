var express = require('express');
var router = express.Router();


//var authc = require('../services/authcService');

/*################ SSO IMPLEMENTATION - START ################*/
var passport = require('passport');
//var session = require('express-session');

passport.serializeUser(function(user, done) {
   done(null, user);
}); 

passport.deserializeUser(function(obj, done) {
   done(null, obj);
});         

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.  
//var services = JSON.parse(process.env.VCAP_SERVICES || "{}");


var gservices_json={"web":
  {
	  "auth_uri":"https://accounts.google.com/o/oauth2/auth",
	  "client_secret":"5ggLrX_xvN4OeGdrEu8aVOuM",
	  "token_uri":"https://accounts.google.com/o/oauth2/token",
	  "client_email":"832291989453-7bi6r5pv6o046fu00i4hggk5j39dgs00@developer.gserviceaccount.com",
	  "redirect_uris":["https://ssodemy-gc2vi2ygw1-ctw5.iam.ibmcloud.com/idaas/mtfim/sps/idaas/login/google/callback"],
	  "client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/832291989453-7bi6r5pv6o046fu00i4hggk5j39dgs00@developer.gserviceaccount.com",
	  "client_id":"832291989453-7bi6r5pv6o046fu00i4hggk5j39dgs00.apps.googleusercontent.com",
	  "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs"}
}


var services_json={
  "SingleSignOn": [
    {
      "name": "Single Sign On-ws",
      "label": "SingleSignOn",
      "plan": "standard",
      "credentials": {
        "secret": "RpnvVrx8pH",
        "tokenEndpointUrl": "https://ssodemy-gc2vi2ygw1-ctw5.iam.ibmcloud.com/idaas/oidc/endpoint/default/token",
        "authorizationEndpointUrl": "https://ssodemy-gc2vi2ygw1-ctw5.iam.ibmcloud.com/idaas/oidc/endpoint/default/authorize",
        "issuerIdentifier": "ssodemy-gc2vi2ygw1-ctw5.iam.ibmcloud.com",
        "clientId": "6GbmlFuE4J",
        "serverSupportedScope": [
          "openid"
        ]
      }
    }
  ]
}

/*
var services_json={
  "SingleSignOn": [
    {
      "name": "Single Sign On-ws",
      "label": "SingleSignOn",
      "plan": "standard",
      "credentials": {
        "secret": "RpnvVrx8pH",
        "tokenEndpointUrl": "https://ssodemy-gc2vi2ygw1-ctw5.iam.ibmcloud.com/idaas/oidc/endpoint/default/token",
        "authorizationEndpointUrl": "https://ssodemy-gc2vi2ygw1-ctw5.iam.ibmcloud.com/idaas/oidc/endpoint/default/authorize",
        "issuerIdentifier": "ssodemy-gc2vi2ygw1-ctw5.iam.ibmcloud.com",
        "clientId": "6GbmlFuE4J",
        "serverSupportedScope": [
          "openid"
        ]
      }
    }
  ]
}
*/

//var services=JSON.parse(services_json || "{}");
var services=services_json;

var ssoConfig = services.SingleSignOn[0]; 
var client_id = ssoConfig.credentials.clientId;
var client_secret = ssoConfig.credentials.secret;
var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
var token_url = ssoConfig.credentials.tokenEndpointUrl;
var issuer_id = ssoConfig.credentials.issuerIdentifier;
//var callback_url = "/auth/sso/callback";


//https://ssodemy-gc2vi2ygw1-ctw5.iam.ibmcloud.com/idaas/mtfim/sps/idaas/login/google/callback
//var callback_url="https://ssodemy-gc2vi2ygw1-ctw5.iam.ibmcloud.com/idaas/mtfim/sps/idaas/login/google/callback";
var callback_url="/index"
var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
var Strategy = new OpenIDConnectStrategy({
	authorizationURL : authorization_url,
	tokenURL : token_url,
	clientID : client_id,
	scope : 'openid',
	response_type : 'code',
	clientSecret : client_secret,
	callbackURL : callback_url,
	skipUserProfile : true,
	issuer : issuer_id
}, function(accessToken, refreshToken, profile, done) {
	   console.log("accessing token");
		process.nextTick(function() {
		profile.accessToken = accessToken;
		profile.refreshToken = refreshToken;
		done(null, profile);
		});
}); 

passport.use(Strategy); 

function ensureAuthenticated(req, res, next) {
	return next(); 
	console.log("ensureauthenitaveted");
	if (!req.isAuthenticated()) {
		req.session.originalUrl = req.originalUrl;
		res.redirect('/login');
	} else {
		return next();
	}
}
/*################ SSO IMPLEMENTATION - END ################*/
/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res) {
	console.log("semchi");
	console.log(JSON.stringify(ensureAuthenticated));
	res.render('index');
});


/*router.get('/', authc.ensureAuthenticated, function(req, res) {
	res.render('index');
});*/

/* GET login page. */

router.get('/login', passport.authenticate('openidconnect', { session: false }));

/*router.get('/login', authc.authenticate);*/

/* GET Authentication Callback URL. */
router.get(callback_url, function(req, res, next) {
	var redirect_url = req.session.originalUrl;
	passport.authenticate('openidconnect', {
		successRedirect : redirect_url,
		failureRedirect : '/failure',
	})(req, res, next);
});
/*router.get(callback_url, function(req, res, next) {
	var redirect_url = req.session.originalUrl;
	authc.authenticateAndRedirect(redirect_url)(req, res, next);
});*/

/* GET Authentication Failure page. */
router.get('/failure', function(req, res) {
	res.send('login failed');
});
module.exports = router;