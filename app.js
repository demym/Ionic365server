/**
 * Public Module dependencies.
 */
 var debugActive=true;
 //var callbacks="http://localhost:3000";
 var callbacks="http://ssodemyapp.mybluemix.net";
 var config = require('./oauth.js')
var express = require('express');
//var RedisStore = require('connect-redis')(express);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var debug = require('debug')('rpozzi-node:server');
var http = require('http');
//var session = require('express-session')
var expressSession = require('express-session')
var cookieSignature=require('cookie-signature');
var cookie=require('cookie');
//var BlueMixOAuth2Strategy = require('passport-bluemix').BlueMixOAuth2Strategy;
var multer = require('multer');
var cors = require('cors');
var jwt= require('jsonwebtoken');

var FACEBOOK_APP_ID = "587829961354143"
var FACEBOOK_APP_SECRET = "15e8a5f53f15b85dc1be4fe3e60f18d0";

var LINKEDIN_API_KEY = "77m4gl9l7fgf9m";
var LINKEDIN_SECRET_KEY = "lhuq3lTGd7dOUWhZ";

var TWITTER_CONSUMER_KEY = "Uzfi2kahegpKUHT2DOnVtY9OH";
var TWITTER_CONSUMER_SECRET = "lGsLNBEP9C9q6k4lW6o8BR6tro8EC1XEDSSfM3DyBSqDcc70qJ";

	//var index = require('./routes/index');
	var installations = require('./routes/installations');
	var upload = require('./routes/upload');
	var items = require('./routes/items');
	var facebook=require('./routes/facebook');
	var linkedin=require('./routes/linkedin');
	var twitter=require('./routes/twitter');
	var sociallogin=require('./routes/sociallogin');
	var dbs=require("./routes/dbs");



	
	global.loggedin=false;
	
/**
 * Single SignOn Module dependencies.
 */
  

var passport = require('passport');
	
var FacebookStrategy = require('passport-facebook').Strategy;
var LinkedInStrategy = require('passport-linkedin').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;



/*var TwitterStrategy = require('passport-twitter').Strategy;
var GithubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google').Strategy;*/

//var session = require('cookie-session');
/**
 * Application Module dependencies.
 */
//var cache = require('./routes/cache');
//var customers = require('./routes/customers');
/**
 * Create and setup Express app
 */
 
 // serialize and deserialize
 

passport.serializeUser(function(user, done) {
done(null, user);
});
passport.deserializeUser(function(obj, done) {
done(null, obj);
});



// config
// Use the FacebookStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Facebook
//   profile), and invoke a callback with a user object.


passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
	enableProof: true,
    callbackURL: callbacks+"/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
       colog("profile: "+JSON.stringify(profile))
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

passport.use(new LinkedInStrategy({
    consumerKey: LINKEDIN_API_KEY,
    consumerSecret: LINKEDIN_SECRET_KEY,
    callbackURL: callbacks+"/linkedin/callback"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's LinkedIn profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the LinkedIn account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: callbacks+"/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Twitter profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitter account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


 
var app = express();



app.use(cookieParser());


/*
app.use(function(req, res, next) {
 
    expressSession({
        'cookie': {
            'httpOnly': false,
            'maxAge': 1000 * 60 * 60 * 24 * 60,
        },
        'key': 'connect.sid',
        'secret': 'keyboard cat',
        'saveUninitialized': false,
        'genid': function() {
 
            //var sessionId = req.param('sessionId');
			
			var sessionId=req.query.sessionId;
			colog("querystring sessionId: "+sessionId);
 
            if (sessionId) {
				
				
				
				return req.query.sessionId;
				
                //return req.param('sessionId');
            }
 
            return "NEWSESSION";
 
        }
 
    })(req, res, next);
 
});
*/

app.use(passport.initialize());
app.use(passport.session());







/*

app.use(function(req, res, next) {
 
    expressSession({
        'cookie': {
            'httpOnly': false,
            'maxAge': 1000 * 60 * 60 * 24 * 60,
        },
        'name': 'connect.sid',
        'secret': 'keyboard cat',
        'saveUninitialized': false,
        'genid': function() {
 
            //var sessionId = req.param('sessionId');
			
			var sessionId=req.query.sessionId;
			colog("useSession: "+sessionId);
 
            if (sessionId) {
				
				
				
				return req.query.sessionId;
				
                //return req.param('sessionId');
            }
 
            return "NEWSESSION";
 
        }
 
    })(req, res, next);
 
});
*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));
app.use(favicon(__dirname + '/public/img/bluemix_logo.png'));
app.use(logger('dev'));


//app.use(app.router());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(multer({dest:'./public/uploads/'}));

/**
 * View engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());

var allowCrossDomain = function(req, res, next) {
res.header('Access-Control-Allow-Origin', '*');
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
next();
}

app.use(allowCrossDomain);


/*
app.use(function(req, res, next) {
 
    var sessionId = req.param('sessionId');  //gets undefined... req.query.sessionId works, instead
    
	
	
	sessionId=req.query.sessionId;
	
	
	colog("app.use sessionId: "+sessionId)
	
    // if there was a session id passed add it to the cookies
    if (sessionId) {
 
        var header = req.headers.cookie;
 
        // sign the cookie so Express Session unsigns it correctly
        var signedCookie = 's:' + cookieSignature.sign(sessionId, 'keyboard cat');
 
        req.headers.cookie = cookie.serialize('connect.sid', signedCookie);
 
    }
 
    next();
 
});
*/

/**
 * Get port from environment and store in Express app
 */
var port = parseInt(process.env.PORT, 10) || 3000;
app.set('port', port);
app.set('superSecret', "inespugnabile");

/*
app.use(function(req, res, next) {
 
    //colog(req)
    var sessionId = req.query.sessionId;
	colog("SESSIONID: "+sessionId)
	req.session.txt=req.session.txt+"a";
    
	if (!sessionId) sessionId="COLLEGATO"
    // if there was a session id passed add it to the cookies
    if (sessionId) {
 
        var header = req.headers.cookie;
 
        // sign the cookie so Express Session unsigns it correctly
        var signedCookie = 's:' + cookieSignature.sign(sessionId, 'stevevai');
 
        req.headers.cookie = cookie.serialize('connect.sid', signedCookie);
        
    }
	//colog(req.session.txt);
 
    next();
 
});
*/

var apiRoutes = express.Router();

app.use(function(req, res, next) {
	
	var whitelist=[
	 "/events/login",
	 "/events/testmail",
	 "/events/testibmmail"
	];
	
	console.log("req.url="+req.url);
	var doNext=false;
	
	for (var i=0; i<whitelist.length; i++){
		var wl=whitelist[i].toLowerCase();
		if (req.url.toLowerCase().indexOf(wl)>-1) doNext=true;
		
	}
	
	if (doNext) {
	 next();
	 return	;
	};
  
  // check header or url parameters or post parameters for token
 // var token = req.body.token || req.query.token || req.headers['x-access-token'];
   var token = req.body.token || req.query.token || req.headers['x-auth-token'];
  console.log("app.use - token: "+token)
   
  // decode token
  if (token) {
    
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
		  console.log("failed to authenticate token: "+err.message)
        return res.json({ success: false, message: 'Failed to authenticate token:'+err.message });    
      } else {
        // if everything is good, save to request for use in other routes
		console.log("token is valid")
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
	
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
	
    
  }
});









/**
 * Routing setup
 */
//app.use('/', index);

//app.use('/users', users);



var services = JSON.parse(process.env.VCAP_SERVICES || "{}");

if (!services.SingleSignOn)
{

services={
  "SingleSignOn": [
    {
      "name": "ssodemy",
      "label": "SingleSignOn",
      "plan": "standard",
      "credentials": {
        "secret": "BF155qagcc",
        "tokenEndpointUrl": "https://ssocommon-4iksdhjbmk-cge7.iam.ibmcloud.com/idaas/oidc/endpoint/default/token",
        "authorizationEndpointUrl": "https://ssocommon-4iksdhjbmk-cge7.iam.ibmcloud.com/idaas/oidc/endpoint/default/authorize",
        "issuerIdentifier": "ssocommon-4iksdhjbmk-cge7.iam.ibmcloud.com",
        "clientId": "DOzNOSSBMt",
        "serverSupportedScope": [
          "openid"
        ]
      }
    }
  ]
}
}
 
var ssoConfig = services.SingleSignOn[0];
var client_id = ssoConfig.credentials.clientId;
var client_secret = ssoConfig.credentials.secret;
var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
var token_url = ssoConfig.credentials.tokenEndpointUrl;
var issuer_id = ssoConfig.credentials.issuerIdentifier;
var callback_url = '/login';



app.get("/prova",function(req,res,next){
	 res.send("bravo gugalione");
	
})

app.get("/testsocial",function(req,res,next){
	 colog("SESSION: "+ JSON.stringify(req.session));
	 colog("sessionId: "+req.sessionID);
	 //req.sessionID=req.query.sessionId;
	 var user={ sessionID: req.query.sessionId };
	 if (req.user) user.user=req.user;
	 colog(JSON.stringify(user))

	 if (req.session)
	{	
	if (!req.session.counter) req.session.counter=0;
	}
	req.session.counter++
	colog("session counter: "+req.session.counter)
	
	var ret={"sessionId":req.sessionID, "counter":req.session.counter}
	
	var socials=[];
		

	
	if (req.session.linkedin) socials.push(req.session.linkedin);
	if (req.session.twitter) socials.push(req.session.twitter);
	if (req.session.facebook) socials.push(req.session.facebook);
	
	 res.send(socials);
	
})

app.get("/testsocial/:sessionid",function(req,res,next){
	 
	 var sid=req.params.sessionid;
	 colog("calling sid: "+sid)
	 req.sessionID=sid;
	 colog("sessionId: "+req.sessionID);
	 colog("csessionId: "+req.cookies["connect.sid"]);
	 var user={ sessionID: req.sessionID };
	 if (req.user) user.user=req.user;
	 colog(req.user)
	 res.send(user);
	
})

app.get("/chat/msg/:msg", function(req, res){
	 var msg=req.params.msg;
	 io.emit('message', { user: "ADMIN",message: msg });
	 res.send("sent "+msg+" to all users");
});

app.get("/chat/rooms", function(req, res){
	
	res.send(JSON.stringify(io.sockets.adapter.rooms));
});

app.get("/chat/users", function(req, res){
	
var clients = findClientsSocket() ;
var cl={};
cl.clients=clients;
var sock=io.sockets.sockets;
//colog(cl)
//res.send(sock.length);
//res.send(JSON.stringify(cl));

var conn="";

var users=[];
io.sockets.sockets.map(function(e) {
    conn+=e.id+" ";
	var user={
		id: e.id,
		email: e.email,
		role: e.role,
		nickname: e.nickname,
		customer: e.customer
		
	}
	users.push(user)
})
res.send(users);
});




app.use("/installations",installations)
app.use("/events",installations)
app.use('/upload',upload);
app.use('/facebook',facebook);
app.use('/linkedin',linkedin);
app.use('/twitter',twitter);
app.use('/sociallogin',sociallogin);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
/**
 * Error handlers
 */
// development error handler
// will print stacktrace
/*
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user

/*
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
*/
/**
 * Create HTTP server.
 */
var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
//server.listen(port);  ///prima di socket.io questo era abilitato


var people = {};  
var rooms = {};  
var clients = [];
var io = require('socket.io').listen(app.listen(port));


//SOCKET.IO definitions



io.sockets.on('connection', function (socket) {
	
	socket.on('create', function(roomname) {
	  colog("created room "+roomname);	
	  //socket.room = roomname;
	  socket.join(roomname);
	  if (roomname.indexOf("ROOM|")>-1)
	  {
	   var arr=roomname.split("|");
       var fromemail=arr[1];
       var toemail=arr[2]; 
	   var r="ROOM|"+fromemail+"|"+toemail;
	
       socket.emit("create",r)	
       colog("emitted create room "+r) 	   
	  }
	  rooms[roomname] = roomname;
      
     
    });
	
	colog("socket id "+socket.id+" connected");
	
	socket.on('message', function(msg){
       colog('received message from socketid '+JSON.stringify(msg));

	  /* var mess={
			text: msg.text,
			from_nickname: msg.from_nickname,
			from_email: msg.from_email,
			to_nickname: msg.to_nickname,
			to_email: msg.to_email,
			room: msg.room
		   
       };
	   */
	   var mess=msg;
	   

	   
	   if (msg.to_email.trim()!=""){
		    io.emit('message', mess)
		  // io.sockets.in(mess.to_email).emit('new_msg', {msg: 'hello'});
		   //io.to(msg.room).emit("message", mess);
	   } else  {
		   msg.room="ROOM|"+mess.from_email+"|"+mess.to_email;
		   io.emit('message', mess);
	   }
    });
	
	socket.on('typing', function(msg){
       //colog('received typing from user: ' + msg.user);
	   io.emit('typing', { message: "", user: msg.user });
    });
	
	socket.on('connected', function(msg){
      
	 // rooms[msg.room] = msg.room;
      //socket.room = msg.room;
      //socket.join(msg.room);
	  
	  socket.id=msg.useremail;
	  socket.email=msg.useremail;
	  
	  var obj={
		dbname: "users",
		field: "email",
		value: msg.useremail
	  }
	
	  dbs.listObjects(obj,function(data){
		//res.send(data);
		if (data.rows[0]){
		var r=data.rows[0].doc;
		
		socket.nickname=r.firstname+" "+r.lastname;
		socket.role=r.role;
		socket.customer=r.company;
		
		
		
		colog('socket id '+socket.id+' joined the chat');
	    io.sockets.in(msg.room).emit('connected', { message: "", user: msg.user });
		} else {
			
			colog("data.rows[0].doc is undefined (625-app.js)")
			
		}
	  });
	  
	  
	  
	  
	  
	  // io.emit('connected', { message: "", user: msg.user });
    });
	
	//socket.emit('message', { message: 'welcome to the chat', user: "Server" });
	
});



server.on('error', onError);
server.on('listening', onListening);
/**
 * Event listener for HTTP server "error" event.
 */
 
 
 

 
 
 
 
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error('Port ' + port + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error('Port ' + port + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  colog('Listening on port ' + server.address().port);
}

function findClientsSocket(roomId, namespace) {
    var res = []
    , ns = io.of(namespace ||"/");    // the default namespace is "/"

    if (ns) {
        for (var id in ns.connected) {
            if(roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId) ;
                if(index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}


function colog(txt)
{
 if (debugActive) console.log(txt);	
	
}


