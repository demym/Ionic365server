/*function authc(props) {
	this.services = props;
	//VCAP_SERVICES contains all the credentials of services bound to
	//this application. For details of its content, please refer to
	//the document or sample of each service.  
	this.ssoConfig = services.SingleSignOn[0]; 
	this.client_id = ssoConfig.credentials.clientId;
	this.client_secret = ssoConfig.credentials.secret;
	this.authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
	this.token_url = ssoConfig.credentials.tokenEndpointUrl;
	this.issuer_id = ssoConfig.credentials.issuerIdentifier;
	this.callback_url = "/auth/sso/callback";
	console.log("##################### client_id = " + this.client_id);
	console.log("##################### client_secret = " + this.client_secret);
	console.log("##################### authorization_url = " + this.authorization_url);
	console.log("##################### token_url = " + this.token_url);
	console.log("##################### issuer_id = " + this.issuer_id);
	console.log("##################### callback_url = " + this.callback_url);
}
authc.prototype = {
		ensureAuthenticated : function(req, res, next) {
			if (!req.isAuthenticated()) {
				req.session.originalUrl = req.originalUrl;
				res.redirect('/login');
			} else {
				return next();
			}
		}
};*/

/*################ SSO IMPLEMENTATION - START ################*/
/*var passport = require('passport');
var session = require('express-session');

passport.serializeUser(function(user, done) {
   done(null, user);
}); 

passport.deserializeUser(function(obj, done) {
   done(null, obj);
});         

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.  
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var ssoConfig = services.SingleSignOn[0]; 
var client_id = ssoConfig.credentials.clientId;
var client_secret = ssoConfig.credentials.secret;
var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
var token_url = ssoConfig.credentials.tokenEndpointUrl;
var issuer_id = ssoConfig.credentials.issuerIdentifier;
var callback_url = "/auth/sso/callback";

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
		process.nextTick(function() {
		profile.accessToken = accessToken;
		profile.refreshToken = refreshToken;
		done(null, profile);
		});
}); 

passport.use(Strategy); */

function ensureAuthenticated(req, res, next) {
	if (!req.isAuthenticated()) {
		req.session.originalUrl = req.originalUrl;
		res.redirect('/login');
	} else {
		return next();
	}
}

function authenticate() {
	passport.authenticate('openidconnect', { session: false });
}

function authenticateAndRedirect(redirect_url) {
	passport.authenticate('openidconnect', {
		successRedirect : redirect_url,
		failureRedirect : '/failure',
	});
}
/*################ SSO IMPLEMENTATION - END ################*/
exports.ensureAuthenticated = ensureAuthenticated;
exports.authenticate = authenticate;
exports.authenticateAndRedirect = authenticateAndRedirect;