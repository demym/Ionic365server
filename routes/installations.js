var express = require('express');
var router = express.Router();
var Cloudant = require('cloudant');
var http = require('http');
var dbs=require("../routes/dbs");
var mail=require("../routes/mail");
var uuid = require('node-uuid');
var jwt    = require('jsonwebtoken');
var app = express();
var superSecret="inespugnabile"
var tokenExpireMinutes=60;
var sendgrid  = require('sendgrid')("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");

	var request = require('request');

//var NodePDF = require('nodepdf');


var url="http://localhost:3000";



var installBuffer=[];

var username = 'cdf8a0ef-8440-4070-b202-b4917838e42f-bluemix';
var password = '44c5f59d97d988269ddf2007661d41b5828ab5761f786ca8458dbc2b00f0c2a7';
var CLOUDANT_REST_URL = "cdf8a0ef-8440-4070-b202-b4917838e42f-bluemix.cloudant.com";
//))var clientsession=require("client-sessions");



//var assetServices = require("../services/assetsService");

var fs = require('fs'),
    xml2js = require('xml2js');

	
var installs;	
	
var parser = new xml2js.Parser();
var fname="a_assets.xml";

var sess;

/* GET users root resource. */
router.get('/', function(req, res) {
 sess=req.session;
console.log("installations get / session: "+JSON.stringify(req.session)); 
//res.send('respond with a resource');
 console.log("called installations");
	 findAll(function(obj) {
		//console.log("###### users ( /getAllAssets route ) -->  " + JSON.stringify(obj));
		res.send(obj);
	});

	
});

/*
router.get("/pdf",function(req,rews{
	var pdf = new NodePDF('http://yahoo.com', 'yahoo.pdf', {
    'viewportSize': {
        'width': 3000,
        'height': 9000
    },
    'paperSize': {
        'pageFormat': 'A4',
        'margin': {
            'top': '2cm'
        },
        'header': {
            'height': '1cm',
            'contents': 'HEADER {currentPage} / {pages}' // If you have 2 pages the result looks like this: HEADER 1 / 2 
        },
        'footer': {
            'height': '1cm',
            'contents': 'FOOTER {currentPage} / {pages}'
        }
    },
    'outputQuality': '80'
    'zoomFactor': 1.1
});
	
	
})
*/

//POST

router.post('/addItem', function(req, res) {
	sess=req.session;
	console.log("sessionid: "+req.sessionID);
	 var tipo = req.body.tipo;   
	var aas = req.body.assignee; 
	var location = req.body.location; 
	console.log("router post installations addItem");
	console.log(JSON.stringify(req.body));
	
	var l=installBuffer.length;
	
	var idx=l++;
	
	installBuffer[idx]=req.body;

	//req.session.addItem="added"; 
	sess.installBuffer = installBuffer;
	sess.save();
    console.log(JSON.stringify(sess));
    console.log("Added item to buffer, now there are "+req.session.installBuffer.length);
	
	
	var o=sess.installBuffer;
	
	console.log("reading now session: "+JSON.stringify(sess));
	
	if (o)
    {	
	var htm="";
	htm+="<li style='font-size:14px'>"+o.length+" elementi</li>";
	for (var i=0; i<o.length; i++)
    {
	 htm+="<li style='font-size:11px'><a href='#'>"+o[i].tipo+" - "+o[i].assignee+" - "+o[i].location+"</a></li>"	
		
	}
    } 
	else 
	{
 	htm="<i>no session found</i>";
	}
	
	//res.redirect('/addItem/addInstallation');
	res.send(htm); 
	
	//res.send("added");
	
});

var mailobj = {
    from: "IBM Client365 <ibmclient365@it.ibm.com>", // sender address
    to: "demymortelliti@it.ibm.com", // list of receivers
    subject: "IBM Client365", // Subject line
    text: "bravo", // plaintext body
    html: "bravo" // html body
}

router.get('/testmail', function(req, res) {
	
	/*mail.sendMail(mailobj,function(maildata) {
			 res.send(maildata);
			 
			 
		 })*/
		 
		sendgrid.send({
			to:       'demymortelliti@it.ibm.com',
			from:     'ibmclient365@it.ibm.com',
			subject:  mailobj.subject,
			text:     mailobj.html
		}, function(err, json) {
		if (err) { return console.error(err); }
		  
			console.log(json);
			res.send(json)
		});
	
	
});


router.get('/testibmmail', function(req, res) {
	
	mail.sendIbmMail(mailobj,function(maildata) {
			 res.send(maildata);
			 
			 
		 })
		 
		
	
});


router.post('/sendmail', function(req, res) {
	
	/*mail.sendMail(mailobj,function(maildata) {
			 res.send(maildata);
			 
			 
		 })*/
		 
		 var mobj=req.body.mailobject;
		 
		sendgrid.send(mobj, function(err, json) {
		if (err) { return console.error(err); }
		  
			console.log(json);
			res.send(json)
		});
	
	
});




router.post("/listallevents",function(req,res){
	var retvalue={
		rows: [],
		events_rssibm: {},
			
		events_rsspp: {}
		
	}
	
	var res_sent=false;
	
    var repemail=req.body.repemail;
	var rssibm_url=req.body.rssibm_url;
	var rsspp_url=req.body.rsspp_url;
	var format=req.body.format;

	
	if (req.body.format) format=req.body.format;
	
	
	//first, get Client365 defined events from Cloudant
	dbs.list("eventcalendar",function(data){
		
		if (data.rows)
		{
		console.log("got ibm365 events type, rows: "+data.rows.length);
		retvalue.rows=data.rows;
		
		//second, get RSS events from IBM global events feedtitle
		
		getFeeds(rssibm_url,function(idata) {
			
			console.log("got rssibm feeds from "+rssibm_url);
			console.log(idata);
			retvalue.events_rssibm=idata;
			
			getFeeds(rsspp_url,function(pdata) {
				console.log("got rsspp feeds from "+rsspp_url);
				retvalue.events_rsspp=pdata;
				res.send(retvalue)
				res_sent=true;
			});
			
		});
		} else {
			res.send("no data was returned by /listallevents")
		}
	});
		
								
	

   //if (!res_sent) res.send("Something went wrong")
	
});

	

router.post("/crossd",function(req,res){
	var host=req.body.host;
	var path=req.body.path;
	var url=req.body.url;
	var format="";
	
	if (req.body.format) format=req.body.format;
	
	


var options = {
  host: host,
  port: 80,
  path: '/' +path
};

	
var request = require('request');
request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
		
		if (format.trim().toLowerCase()=="xml")
		{
			parser.parseString(body, function (err, result) {
             
		      if (err) {
				  console.log("Error parsing XML: "+err);
				  res.send({"error":true,"msg":err.message})
				  return;
				  
			  }
			  
			  res.send(result);
			  
			  
		    });
		//console.log(result);
          return;
			
		}
		
		res.send(body);
		return;
    }
	if (error)
	{
	 console.log("error reading remote file: "+error.message);
     res.send({"error":true,"msg":error.message})
		return;
	}
});
	
});


router.post("/addsharenew",function(req,res){
	
	/* expected body:
	
	{
	 userid: id,
     sharetype: 'EVENT|ELIBRARY|...',
     shareid: eventid, (or elibrary id, .....) OR event title...
	}
	
	
	this will be added to share object inside user:
	
	shares: [{
		sharetype: EVENT,
		shareid: id or title
		
    },.....]
	
	
	*/
	
	var body=req.body;
	
	

	console.log(JSON.stringify(body))	
		
	
	var dbname=body.db;
	var ids=body.ids.split(",");
	console.log(ids.length);
	var users=body.users.split(",");
	
	var shareType="EVENT";
	if (dbname=="elibrary") shareType="ELIBRARY";
	
	//read objects
	
	console.log("share objects from "+dbname+" ("+ids+") with users "+body.users);
	
	//get users actual sharing
	for (var i=0; i<users.length; i++){
		dbs.listById("users",users[i],function(data){
			var u=data.rows[0];
			var user=u.doc;
			console.log(JSON.stringify(data))
			//check if there are shares
			var shares=user.shares;
			if (!shares) {
				shares=[];   
			} else {  
			   //delete all current shares of type shareType
			   for (var x=0; x<shares.length; x++){
				   var s=shares[x];
				   if (s.type==shareType) shares.splice(x, 1);
				   
			   }
                				
 				
			}
			
			//add objects to share
			console.log(ids.length);
			for (var j=0; j<ids.length; j++){
				var share={
					type: shareType,
					id: ids[j]
				}
				shares.push(share)
				console.log(share.length)
				
			}
			user.shares=shares;
			console.log("user shares: "+JSON.stringify(user.shares))
			
			dbs.update("users",u,function(data){
				console.log("update complete")
				
			})
		
			
			
			
			
		});	
		
		
	}
	
	res.send("ok");
	
	return;
	for (var i=0; i<ids.length; i++){
		
		dbs.listById(dbname,ids[i],function(data){
			console.log(JSON.stringify(data));
			var doc=data.rows[0].doc;
			console.log("doc:"+JSON.stringify(doc));
			//doc._id=doc.id;
			//doc._rev=doc.rev;
			var sharelist="";
			var u=body.users.split(",");
			/*
			for (var j=0; j<u.length; j++){
				var us=u[j];
				console.log("checking for user "+us);
				if (doc.sharewith)
				{
			     console.log("doc has sharewith");		 
				 if (doc.sharewith.indexOf(us)==-1)
				 {
				  if (sharelist.trim()!="") sharelist+=",";
				  sharelist+=us;	
				 }					 
					
				} else sharelist=body.users;
				
				
			}
			*/
			
			sharelist=body.users;
			
			
			console.log("sharelist: "+sharelist)
			//doc.sharewith=body.users;
			doc.sharewith=sharelist;
			
			console.log("updobj: "+JSON.stringify(doc));
			
			dbs.update(dbname,doc,function(data){
		
		      console.log("updated "+JSON.stringify(data))
		
		      console.log("dbs update: "+JSON.stringify(data));
			 
		
	          })
			
		})
		
		
	}
	
	res.send({"error":false,"msg":"share added"});
	return;
	
	
	
	 dbs.list(dbname,function(data){	
	    for (var i=0; i<ids.length; i++)
	    {
		 var sid=ids[i];
		 console.log(sid);
		 for (var j=0; j<data.rows.length; j++)
		 {
		  var dbid=data.rows[j].doc._id;
		   var dbrev=data.rows[j].doc._rev;
          if (dbid==sid){
			  //check if some user is already sharing
	          var userlist="";
			   for (var x=0; x<users.length; x++)
			  {
				if (userlist.trim()!="") userlist+=",";
				userlist+=users[x];
			  }	
			  
			  
			  var updobj={};
			  updobj.id=dbid;
			  updobj._id=dbid;
			  updobj.rev=dbrev;
			  updobj._rev=dbrev;
			  updobj.sharewith=userlist;
			  
			  
			  console.log("updobj: "+JSON.stringify(updobj));
			  
			  dbs.update(dbname,updobj,function(data){
		
		     // console.log("updated "+JSON.stringify(data))
		
		      //console.log("dbs update: "+JSON.stringify(data));
			 
		
	          })
	
				
			 } 
			  
			  
				  
			 }			  
			  
			  
			  
		  }		  
			 

	  
	  });
	
	
	

	
	
	
	
	res.send({"updated":"ok"});
	
	
})


router.post("/addshare",function(req,res){
	
	var body=req.body;
	var retvalue={"error":false,"msg":"share added"};

	console.log("BODY: "+JSON.stringify(body))	
		
	
	var dbname=body.db;
	var ids=body.ids.split(",");
	var obj=JSON.parse(body.shareobject);
	console.log(ids.length);
	var users=body.users.split(",");
	
	console.log("OBJ: "+obj)
	console.log("found "+ids.length+" objectid to share")
	
	
	//read objects
	
	
	for (var i=0; i<ids.length; i++){
		
		var sids=ids[i];
		
		var rss=false;
		var source="CLOUDANT";
		var what="EVENT";
		if (dbname=="elibrary") what="ELIBRARY";
		
		if (sids.toLowerCase().substring(0,3)=="rss") rss=true;
		//rss=true;
		
		var doIt=true;
		
		if (doIt){   //it's an RSS share
			
			
			
			if (rss) {
				console.log("it is an rss share --> "+sids)
				source="FEED_IBM";
				if (sids.toLowerCase().substring(0,6)=="rsspp") source="FEED_PP";
			}	
			
			console.log(what+" source: "+source);
			console.log(what+": "+JSON.stringify(obj));
			
			var shareobj={ 
				//what: "EVENT|ELIBRARY|FEED",
				what: what,
				//source: "CLOUDANT|FEED_IBM|FEED_PP",
				source: source,
				feedtitle: "",
				shareobject: obj,
				sharewith: body.users
			}
			var checkid=shareobj.shareobject.id;
			console.log("check if shareobject "+checkid+" already present in db shares");
			
			
			
			
			
			
			var exists=false;
			var rowid="";
			var rowrev="";
			
			dbs.list("shares",function(data){
				console.log("got "+data.rows.length+" records from shares db")
				if (data.rows.length>0){
					for (var j=0; j<data.rows.length; j++){
						var row=data.rows[j].doc;
						
						var sh=row.shareobject;
						var shid=sh.id;
						if (shid==checkid){
							exists=true;
							rowid=row._id;
							rowrev=row._rev;
						}	
						
						
					}
					
				}			
					
					
			
			dbname="shares";
			var ddoc={doc: shareobj}
			if (exists){
				console.log("this share object already exists in share db: id->"+rowid+" - rev->"+rowrev)
				shareobj._id=rowid;
				shareobj._rev=rowrev;
				
			} else console.log("this share object does not exists in share db");
			console.log("preparing to write SHAREOBJ: "+JSON.stringify(shareobj))
			dbs.update(dbname,shareobj,function(data){
		
		      console.log("updated "+JSON.stringify(data))
		
		      console.log("dbs update: "+JSON.stringify(data));
			 
		
	          })
			
					
					
					
			
				
				
			})
			
			
			
			
			
			
			
		} 
		else   //CLOUDANT SHARE
		{
		
		console.log("searching for object "+ids[i]+" in db "+dbname);
		
		dbs.listById(dbname,ids[i],function(data){
			console.log("data: "+JSON.stringify(data))
			console.log(data.rows.length)
			if (data.rows.length==0){
				retvalue.error=true;
				retvalue.msg="No rows with id="+sids+" found in db "+dbname;
				console.log(retvalue.msg)
				
			} else
			{
			console.log(JSON.stringify(data));
			var doc=data.rows[0].doc;
			console.log("doc:"+JSON.stringify(doc));
			//doc._id=doc.id;
			//doc._rev=doc.rev;
			var sharelist="";
			var u=body.users.split(",");
			/*
			for (var j=0; j<u.length; j++){
				var us=u[j];
				console.log("checking for user "+us);
				if (doc.sharewith)
				{
			     console.log("doc has sharewith");		 
				 if (doc.sharewith.indexOf(us)==-1)
				 {
				  if (sharelist.trim()!="") sharelist+=",";
				  sharelist+=us;	
				 }					 
					
				} else sharelist=body.users;
				
				
			}
			*/
			
			sharelist=body.users;
			
			
			console.log("sharelist: "+sharelist)
			//doc.sharewith=body.users;
			doc.sharewith=sharelist;
			
			console.log("updobj: "+JSON.stringify(doc));
			
			dbs.update(dbname,doc,function(data){
		
		      console.log("updated "+JSON.stringify(data))
		
		      console.log("dbs update: "+JSON.stringify(data));
			 
		
	          })
			
		}
		})
		
	
		}
	}
	
	console.log(JSON.stringify(retvalue))
	res.send(retvalue);
	return;
	
	
	
	 dbs.list(dbname,function(data){	
	    for (var i=0; i<ids.length; i++)
	    {
		 var sid=ids[i];
		 console.log(sid);
		 for (var j=0; j<data.rows.length; j++)
		 {
		  var dbid=data.rows[j].doc._id;
		   var dbrev=data.rows[j].doc._rev;
          if (dbid==sid){
			  //check if some user is already sharing
	          var userlist="";
			   for (var x=0; x<users.length; x++)
			  {
				if (userlist.trim()!="") userlist+=",";
				userlist+=users[x];
			  }	
			  
			  
			  var updobj={};
			  updobj.id=dbid;
			  updobj._id=dbid;
			  updobj.rev=dbrev;
			  updobj._rev=dbrev;
			  updobj.sharewith=userlist;
			  
			  
			  console.log("updobj: "+JSON.stringify(updobj));
			  
			  dbs.update(dbname,updobj,function(data){
		
		     // console.log("updated "+JSON.stringify(data))
		
		      //console.log("dbs update: "+JSON.stringify(data));
			 
		
	          })
	
				
			 } 
			  
			  
				  
			 }			  
			  
			  
			  
		  }		  
			 

	  
	  });
	
	
	

	
	
	
	
	res.send({"updated":"ok"});
	
	
})



router.post('/signupuser',function(req,res){
	 //console.log(JSON.stringify(req.body));
	 
	 
	 
	 var retvalue={};
	 
	 
	 var urecord=req.body;
	 urecord.useractive="false";
	 urecord.authcode=generateToken(16);
	 var url=urecord.url;
	 var company=urecord.company;
	 var seller=urecord.seller;
	 
	 console.log("Signup request incoming from user "+urecord.email);
	 

	 //res.send(urecord.authcode);
	 dbs.list("users",function(data){
		 if (data.rows)
		 {
		  for (var i=0; i<data.rows.length;i++)
		  {
			var doc=data.rows[i].doc;
            if (doc.email==urecord.email){
				//user (email) already existing
				var msg="User with email "+doc.email+" already existing";
				console.log(msg+", aborting");
				res.send({"error":"true","msg":msg});
				return;
				
			}	
            
 	
			  
		  }		

	dbs.insert("users",urecord,function(data){
		 
		 	if (data.error){
				console.log("Error inserting user "+urecord.email+": "+data.msg);
				res.send(data);
				return;
			}
		
		 
		// res.send(data);
		 mailobj.to=urecord.email;
		 mailobj.subject="IBM Client365 account activation";
		 mailobj.text="Your IBM Client365 account has been created. You can activate your account by clicking the following link: "
		 mailobj.text+=url+"/events/signupuser/"+urecord.authcode;
		 mailobj.html="Your IBM Client365 account has been created.<br><br>You can activate your account by clicking the following link:<br>";
		 mailobj.html+="<br><a href='"+url+"/events/signupuser/"+urecord.authcode+"'>"+url+"/events/signupuser/"+urecord.authcode+"</a>";
		 res.send(data);
		 
		 
		 sendgrid.send({
			to:       'demymortelliti@it.ibm.com',
			from:     'client365@it.ibm.com',
			subject:  mailobj.subject,
			text:     mailobj.html
		}, function(err, json) {
		if (err) { return console.error(err); }
			console.log(json);
		});
	
		 
		 
		
		 
		 
		 
		
		 
		 
	 })			
			  		  
			 
		 } else {
			 
			 
			 console.log("Error reading users list");
			 res.send({"error":"true","msg":"Error reading users list"});
			 
			 return;
			 
		 }
		 
		 
	 })
	 
	 
	 
	
	
	
	
})


router.post('/login',function(req,res){
	
	console.log(JSON.stringify(req.body));
	
	var email=req.body.email;
	var psw=req.body.password;
	
	var logginuser={}

	var loggedin=false;
	var sessionid=req.query.sessionId;
	
	var role="";
	var company="";
	var customers="";
	var firstname="";
	var lastname="";
	var userid="";

	
	dbs.list("users",function(data){
		if (data.rows){
			
			for (var i=0; i<data.rows.length; i++){
				var user=data.rows[i].doc;
				var row=data.rows[i].doc;
				
				var validUser=false;

				
				
				if  ((email.trim()==user.email) && (psw.trim()==user.password) && (user.useractive=="true")) validUser=true;
			    if (validUser)		
				{
				 if (row.role) role=row.role;
				 if (row.company) company=row.company;
				 if (row.customers) customers=row.customers;
				 if (row.firstname) firstname=row.firstname;
				 if (row.lastname) lastname=row.lastname;
				 
				 if (row._id) userid=row._id;
				 row.sessionid=sessionid;
				 dbs.update("users",row,function(){
					 
					 console.log("sessionid stored for this user")
					 
				 })
				 loggedin=true;	
				 logginuser=user.email;
				 
				 
				}
				
				
			}
			
			
		}
		
		if (loggedin)
		{
		 console.log("User "+email+" successfully logged in to application")	;
		 console.log("req.user: "+req.user)
		 var tokenv4=uuid.v4();
		 var token = jwt.sign(logginuser, superSecret, {
                   expiresInMinutes: tokenExpireMinutes // expires in 24 hours
         });
		 console.log("created new token "+token)
		 res.send({ "loggedin":"true","tokenv4":tokenv4,"token": token,"role": role,"company":company,"customers":customers,"firstname":firstname,"lastname":lastname,"id":userid,"email":email});	
		} else {
			console.log("Login failed for user "+email)	;
		 res.send({ "loggedin":"false"});	
		}
		
	});
	
});



router.post('/loginw',function(req,res){
	
	console.log(JSON.stringify(req.body));
	
	var email=req.body.email;
	//var psw=req.body.password;

	var loggedin=false;
	var sessionid=req.query.sessionId;
	
	var role="";
	var company="";
	var customers="";
	var firstname="";
	var lastname="";
	var userid="";
	
	if (!email) email="notexistent@email.com"

	
	dbs.list("users",function(data){
		if (data.rows){
			
			for (var i=0; i<data.rows.length; i++){
				var user=data.rows[i].doc;
				var row=data.rows[i].doc;
				
				var validUser=false;

				
				
				if  ((email.trim()==user.email) && (user.useractive=="true")) validUser=true;
			    if (validUser)		
				{
				 if (row.role) role=row.role;
				 if (row.company) company=row.company;
				 if (row.customers) customers=row.customers;
				 if (row.firstname) firstname=row.firstname;
				 if (row.lastname) lastname=row.lastname;
				 
				 if (row._id) userid=row._id;
				 row.sessionid=sessionid;
				 dbs.update("users",row,function(){
					 
					 console.log("sessionid stored for this user")
					 
				 })
				 loggedin=true;	
				 logginuser=user.email;
				}
				
				
			}
			
			
		}
		
		if (loggedin)
		{
		 console.log("User "+email+" successfully logged in to application")	;
		 console.log("req.user: "+req.user)
		 var tokenv4=uuid.v4();
		 var token = jwt.sign(logginuser, superSecret, {
                   expiresInMinutes: tokenExpireMinutes // expires in 24 hours
         });
		 console.log("created new token "+token)
		 res.send({ "loggedin":"true","token": token, "tokenv4": tokenv4,"role": role,"company":company,"customers":customers,"firstname":firstname,"lastname":lastname,"id":userid,"email":email});	
		} else {
			console.log("Login failed for user "+email)	;
		 res.send({ "loggedin":"false"});	
		}
		
	});
	
});



router.post('/loginwithtwitter',function(req,res){
	
	console.log(JSON.stringify(req.body));
	
	var email=req.body.email;
	var loggedin=false;
	
	var role="";
	var company="";
	var customers="";
	var firstname="";
	var lastname="";
	var userid="";

	
	dbs.list("users",function(data){
		if (data.rows){
			
			for (var i=0; i<data.rows.length; i++){
				var user=data.rows[i].doc;
				var row=data.rows[i].doc;
				
				var validUser=false;
				if  ((email.trim()==user.email) && (user.useractive=="true")) validUser=true;
				
				
				//if  ((email.trim()==user.email) && (psw.trim()==user.password) && (user.useractive=="true"))
			    if (validUser)		
				{
				 if (row.role) role=row.role;
				 if (row.company) company=row.company;
				 if (row.customers) customers=row.customers;
				 if (row.firstname) firstname=row.firstname;
				 if (row.lastname) lastname=row.lastname;
				 
				 if (row._id) userid=row._id;
				 row.sessionid=sessionid;
				 dbs.update("users",row,function(){
					 
					 console.log("sessionid stored for this user")
					 
				 })
				 loggedin=true;	
				}
				
				
			}
			
			
		}
		
		if (loggedin)
		{
		 console.log("User "+email+" successfully logged in to application")	;
		 console.log("req.user: "+req.user)
		 res.send({ "loggedin":"true","role": role,"company":company,"customers":customers,"firstname":firstname,"lastname":lastname,"id":userid,"email":email});	
		} else {
			console.log("Login failed for user "+email)	;
		 res.send({ "loggedin":"false"});	
		}
		
	});
	
});



router.get('/signupuser/:token', function(req, res) {
	
		var token=req.params.token;
		dbs.list("users",function(data){
			
			if (data.error){
				console.log("Error getting users list");
				res.send(data);
				return;
			}
			
			//console.log(JSON.stringify(data));
			var found=false;
			var updrec={
				
			};
			
			console.log("signup activation request from token "+token);
			
			if (data.rows)
			{	
			
			for (var i=0; i<data.rows.length; i++){
				
				var doc=data.rows[i].doc;
				var tok=doc.authcode;
				
				if (tok==token) {
					updrec=doc;
					updrec.id=doc._id;
					updrec.rev=doc._rev;
					updrec.useractive="true";
					found=true;
					//console.log("UPDREC: "+JSON.stringify(updrec));
				} 
				
				
			}
			}
			if (found){
				dbs.update("users",updrec,function(data){
		
					//console.log("updated "+JSON.stringify(data))
		
					//console.log("dbs update: "+JSON.stringify(data));
			      //res.send(data);
				    var uname=updrec.firstname+" "+updrec.lastname;
					
				    var htm= "Thank you "+uname.toUpperCase()+".<br><br> your account on IBM Digital Collaboration Hub has been activated.<br>";
					htm+="<br>You can login into the application using the credentials you have provided."
					console.log("User "+updrec.email+" activation completed");
				    res.send(htm)
		
	             })
            } else {
				
			 console.log("Token "+ token+" not existing, user not activated" );	
			 res.send({ error: "token not found, user not activated"});	
			}
				
				
			
			
			
			
		})
});


router.post('/savecalendarevent', function(req, res) {
	
	
	console.log(JSON.stringify(req.body));
	
	
	dbs.insert("eventcalendar",req.body,function(data){
		
		console.log("inserted "+JSON.stringify(data))
		
		console.log("dbs insert: "+JSON.stringify(data));
			res.send(data);
		
	})
   
});

router.post('/updcalendarevent', function(req, res) {
	
	
	console.log(JSON.stringify(req.body));
	
	
	dbs.update("eventcalendar",req.body,function(data){
		
		console.log("updated "+JSON.stringify(data))
		
		console.log("dbs update: "+JSON.stringify(data));
			res.send(data);
		
	})
   
});


router.post('/deletecalendarevent', function(req, res) {
	
	
	console.log("Delete calendar event "+JSON.stringify(req.body));
	
	dbs.remove("eventcalendar",req.body,function(data){
		
		console.log("deleted "+JSON.stringify(data))

			res.send(data);
		
	})
   
});

router.post('/deletedocument', function(req, res) {
	
	
	console.log("Delete document "+JSON.stringify(req.body));
	
	
	dbs.list("elibrary", function(obj){
		
		console.log(" ")
		console.log(" ")
		console.log("obj: "+JSON.stringify(obj))
		
		//delete file first
		//console.log("got object: "+JSON.stringify(obj));
		var pth="";
	    for (var i=0; i<obj.rows.length; i++)
		{
		 var row=obj.rows[i];
		 if (row.doc._id==req.body.id) {
			 pth=row.doc.path;
             break;			 
		 }
		}	
		
		console.log(" ")
		console.log("deleting file "+pth);
		
		//fs.unlinkSync(pth);
		
		fs.unlink(pth, function (err) {
           if (err) {
			  console.log("File "+pth+" unlink error :" +err.message);
			  
		   } else console.log('successfully deleted '+pth); 
   
            dbs.remove("elibrary",req.body,function(data){
		    console.log("deleted "+JSON.stringify(data))
			res.send(data);
		
	   }) 			 
			   
		 
        });
		
		

		
	
		
		
	}); 
		
		
	
	
   
});



router.get('/listcalendarevents', function(req, res) {
	

	
	//console.log(JSON.stringify(req.body));
	
	
	dbs.list("eventcalendar",function(data){
		
		//console.log("list result: "+JSON.stringify(data))
	
		res.send(data);
		
	})
   
});



router.get('/usergroups', function(req, res) {
	

	
	//console.log(JSON.stringify(req.body));
	var groups=[];
	
	dbs.list("users",function(data){
		
		//console.log("list result: "+JSON.stringify(data))
		var rows=data.rows;
		
		console.log("found "+rows.length+" users");

		if (rows.length==0) {
			res.send(groups);
			return;
			
		} else {
			
		
		for (i=0;i<data.rows.length;i++){
			var row=data.rows[i].doc;
			
			var user={
				firstname: row.firstname,
				lastname: row.lastname,
				email: row.email,
				company: row.company,
				role: row.role,
				jobrole: row.jobrole,
				id: row._id
			}
			
			console.log(user);
	
				
				var group="_UNDEFINED";
				
				if (row.group) {
					group=row.group;
					console.log("this row has a group: "+group)
				} else console.log("no group found for this row");
				
				
				
				//check if group is already existing
				var gexists=false;
				for (var j=0; j<groups.length; j++){
					if (groups[j].name.toLowerCase().indexOf(group.toLowerCase())>-1) {
						gexists=true;
						
						
						groups[j].users.push(user);
					}
					
				}
				
				if (!gexists)
				{
					var gobj={
						name: group,
						users: []
						
					}
					gobj.users.push(user);
					groups.push(gobj);
					
				}
				
				
				
				
			}
			
		}
	    
		res.send(groups);
		
	})
   
});



router.get('/listcalendarevents/byuserid/:userid', function(req, res) {
	
	var uid=req.params.userid;
	
	//console.log(JSON.stringify(req.body));
	
	
	dbs.list("eventcalendar",function(data){
		
		//console.log("list result: "+JSON.stringify(data))
		if (uid.trim()!=""){
			var cdata={ rows: []};
			console.log("filtering calendar events for userid "+uid);
			for (var i=0; i<data.rows.length; i++){
				var sw="";
				if (data.rows[i].doc.sharewith) sw=data.rows[i].doc.sharewith.trim().toLowerCase();
				if (sw.indexOf(uid.trim().toLowerCase())>-1)
				{
				 cdata.rows.push(data.rows[i]);	
					
				}
				
			}
			data=cdata;
			
			
		}
		res.send(data);
		
	})
   
});


router.get('/listelibrary/byuserid/:userid', function(req, res) {
	
	var uid=req.params.userid;
	
	//console.log(JSON.stringify(req.body));
	
	
	dbs.list("elibrary",function(data){
		
		//console.log("list result: "+JSON.stringify(data))
		if (uid.trim()!=""){
			var cdata={ rows: []};
			console.log("filtering elibrary documents for userid "+uid);
			for (var i=0; i<data.rows.length; i++){
				var sw="";
				if (data.rows[i].doc.sharewith) sw=data.rows[i].doc.sharewith.trim().toLowerCase();
				if (sw.indexOf(uid.trim().toLowerCase())>-1)
				{
				 cdata.rows.push(data.rows[i]);	
					
				}
				
			}
			data=cdata;
			
			
		}
		res.send(data);
		
	})
   
});





router.get('/listcalendarevents/:company', function(req, res) {
	
	var company=req.params.company;
	
	//console.log(JSON.stringify(req.body));
	
	
	dbs.list("eventcalendar",function(data){
		
		//console.log("list result: "+JSON.stringify(data))
		if (company.trim()!=""){
			var cdata={ rows: []};
			console.log("filtering calendar events for company "+company);
			for (var i=0; i<data.rows.length; i++){
				if (data.rows[i].doc.customer.trim().toLowerCase()==company.trim().toLowerCase())
				{
				 cdata.rows.push(data.rows[i]);	
					
				}
				
			}
			data=cdata;
			
			
		}
		res.send(data);
		
	})
   
});

router.get('/listelibrary', function(req, res) {
	
	
	//console.log(JSON.stringify(req.body));
	
	
	dbs.list("elibrary",function(data){
		
		//console.log("list result: "+JSON.stringify(data))
		res.send(data);
		
	})
   
});

router.get('/listusers', function(req, res) {
	
	
	//console.log(JSON.stringify(req.body));
	
	
	dbs.list("users",function(data){
		
		//console.log("list result: "+JSON.stringify(data))
		res.send(data);
		
	})
   
});

router.get('/listusers/byid/:uid', function(req, res) {
	var uid=req.params.uid;
	
	var cdata={ rows: []};
	
	//console.log(JSON.stringify(req.body));
	
	
	dbs.list("users",function(data){
		
		for (var i=0; i<data.rows.length; i++) {
			
			var doc=data.rows[i].doc;
			var id=doc._id;
			if (id==uid){
				cdata.rows.push(data.rows[i])
			}
			
			
		}
		//console.log("list result: "+JSON.stringify(data))
		res.send(cdata);
		
	})
   
});


router.get('/listobjects/byid/:dbname/:id', function(req, res) {
	var uid=req.params.id;
	var dbname=req.params.dbname;
	
	var cdata={ rows: []};
	
	//console.log(JSON.stringify(req.body));
	
	
	dbs.list(dbname,function(data){
		
		for (var i=0; i<data.rows.length; i++) {
			
			var doc=data.rows[i].doc;
			var id=doc._id;
			if (id==uid){
				cdata.rows.push(data.rows[i])
			}
			
			
		}
		//console.log("list result: "+JSON.stringify(data))
		cdata.total_rows=cdata.rows.length;
		res.send(cdata);
		
	})
   
});


router.get('/listobjects/byfield/:dbname/:field/:value', function(req, res) {
	var field=req.params.field;
	var dbname=req.params.dbname;
	var value=req.params.value;
	
	var obj={
		dbname: dbname,
		field: field,
		value: value
	}
	
	dbs.listObjects(obj,function(data){
		res.send(data);
	});
	
	
});

router.post('/listobjects/byfield/:dbname/:field/:value', function(req, res) {
	var field=req.params.field;
	var dbname=req.params.dbname;
	var value=req.params.value;
	
	var obj={
		dbname: dbname,
		field: field,
		value: value
	}
	
	dbs.listObjects(obj,function(data){
		res.send(data);
	});
	
	
});

router.get('/listobjects/:dbname', function(req, res) {
	
	var dbname=req.params.dbname;
	
	
	//console.log(JSON.stringify(req.body));
	
	
	dbs.list(dbname,function(data){
		
		
		//console.log("list result: "+JSON.stringify(data))

		res.send(data);
		
	})
   
});


router.post('/deleteobject/:dbname', function(req, res) {
	
	var dbname=req.params.dbname;
	
	console.log("Delete object from "+dbname+": "+JSON.stringify(req.body));
	
	dbs.remove(dbname,req.body,function(data){
		
		console.log("deleted "+JSON.stringify(data))

			res.send(data);
		
	})
   
});



router.post('/deleteobject/byid/:dbname/:id', function(req, res) {
	
	var dbname=req.params.dbname;
	var id=req.params.id;
	var retvalue={};
	var found=false;
	
	dbs.list(dbname,function(data){
		
		for (var i=0; i<data.rows.length; i++) {
			
			var doc=data.rows[i].doc;
			var uid=doc._id;
			if (id==uid){
				found=true;
				var rev=doc._rev;
				doc.id=doc._id;
				doc.rev=doc._rev;
				dbs.remove(dbname,doc,function(ddata){
		
		          console.log("deleted id "+uid+" from "+dbname)

			        retvalue=ddata;
				  
		
	           })
			}
			
			
		}
		//console.log("list result: "+JSON.stringify(data))

	if (found)
        {
		 res.send(retvalue)	
		} else
		{
				var msg="id " +id+" in db "+dbname+" not found";
		res.send({"error":true,"msg":msg});
		}			
		
	})
   
    
	
	
   
});




router.post('/updateobject/byid/:dbname/:id', function(req, res) {
	
	var dbname=req.params.dbname;
	var id=req.params.id
	var body=req.body;
	var retvalue={};
	var found=false;
	
	dbs.list(dbname,function(data){
		
		for (var i=0; i<data.rows.length; i++) {
			
			var doc=data.rows[i].doc;
			var uid=doc._id;
			if (id==uid){
				var rev=doc._rev;
				found=true;
				var doc2=doc;
				for (var key in body){
					doc2[key]=body[key];
					
				}
				dbs.update(dbname,doc2,function(ddata){
		
		            console.log("updated object in  "+dbname+": "+JSON.stringify(ddata))
		
		          //console.log("dbs update: "+JSON.stringify(data));
			      retvalue=ddata;
				
		
	            })
			}
			
			
		}
		//console.log("list result: "+JSON.stringify(data))

		if (found)
        {
		 res.send(retvalue)	
		} else
		{
				var msg="id " +id+" in db "+dbname+" not found";
		res.send({"error":true,"msg":msg});
		}			
	
		
	})
   
    
	
	
   
});


router.post('/updateobject/:dbname', function(req, res) {
	
	var dbname=req.params.dbname;
	
	console.log(JSON.stringify(req.body));
	
	
	dbs.update(dbname,req.body,function(data){
		
		console.log("updated object in  "+dbname+": "+JSON.stringify(data))
		
		//console.log("dbs update: "+JSON.stringify(data));
			res.send(data);
		
	})
   
});


router.post('/addobject/:dbname', function(req, res) {
	
	var dbname=req.params.dbname;
	
	console.log(JSON.stringify(req.body));
	
	
	dbs.insert(dbname,req.body,function(data){
		
		console.log("inserted "+JSON.stringify(data))
		
		console.log("dbs insert: "+JSON.stringify(data));
			res.send(data);
		
	})
   
});

router.post('/addItem/addInstallation', function(req, res) {
	sess=req.session;
	console.log("sessionid: "+req.sessionId);
	console.log("router post addInstallation - session: "+JSON.stringify(sess));
	console.log(installBuffer.length);
	console.log("reading session: "+JSON.stringify(sess));
	console.log("Storing "+sess.installBuffer.length+" items as installation");
	
	var today = new Date();
    var dateString = today.yyyymmdd();
	
	var addInst={
		'name':generateId(),
		'date': dateString,
		'items': []
		
	};
	
	for (var i=0; i<sess.installBuffer.length; i++)
	{
	 var it=sess.installBuffer[i];
     addInst.items[i]=it;	 
		
	}
	
	
	dbs.addItemREST("installations",addInst,function() {
		console.log("added installation to cloudant db");
	    sess.installBuffer=[];
		installBuffer=[];
		
	})
	
	
	
	res.send("stored");
   
});


/* GET all users. */
// ############################## UNCOMMENT FOR DEMO
router.get('/findall', function(req, res) {
	console.log("called installations findall");
	console.log("session: "+JSON.stringify(req.session));
	
	findAll(function(data){
		res.send(data);
	});
	
});

router.get('/findselectall', function(req, res) {
	console.log("called installations findselectall");
	console.log("session: "+JSON.stringify(req.session));
	
	findSelectAll(function(data){
		res.send(data);
	});
	
});

router.get('/carrello', function(req, res) {
	console.log("called installations carrello");
	console.log("session: "+JSON.stringify(req.session));
	
	var o=req.session.installBuffer;
	
	console.log(JSON.stringify(o))
	
	if (o)
    {	
	var htm="";
	htm+="<li style='font-size:14px'>"+o.length+" elementi</li>";
	for (var i=0; i<o.length; i++)
    {
	 htm+="<li style='font-size:11px'><a href='#'>"+o[i].tipo+" - "+o[i].assignee+" - "+o[i].location+"</a></li>"	
		
	}
    } 
	else 
	{
 	htm="<i>no session found</i>";
	}
	
	
	res.send(htm); 
	
});

router.post('/carr', function(req, res) {
	console.log("called installations carr");
	console.log("session: "+JSON.stringify(req.session));
	
	var o=req.session.installBuffer;
	
	console.log(JSON.stringify(o))
	
	if (o)
    {	
	var htm="";
	htm+="<li style='font-size:14px'>"+o.length+" elementi</li>";
	for (var i=0; i<o.length; i++)
    {
	 htm+="<li style='font-size:11px'><a href='#'>"+o[i].tipo+" - "+o[i].assignee+" - "+o[i].location+"</a></li>"	
		
	}
    } 
	else 
	{
 	htm="<i>no session found</i>";
	}
	
	
	res.send(htm); 
	
});





router.get('/nome/:nome', function(req, res)  {
	console.log("called locations findByName");
	var nome=req.params.nome;
	//res.send(risp);
	findByName(nome,function(obj) {
		res.send(obj);
	});
	

});

router.post('/deletebyid/:id', function(req, res) {
	var id=req.params.id; 
	console.log("delete item "+id);
	dbs.deleteItemREST("installations", id, function(data){
		console.log("deleted item "+id);
		
		findAll(function(data){
			res.send(data);
		});
		
	})


	
});	


function findByName(nome,callback) {

	 if (!global.loggedin) {
	  res.send("User not logged in");	
	  return;	
	}
    console.log('assets findByName=' + nome);
    if (nome) {
        var results = assets.filter(function(element) {
			
			if (element.ASSET_SN)
			{	
            var fullName = element.ASSET_SN[0];
			//console.log(fullName);
			var retval=(fullName.toLowerCase().indexOf(nome.toLowerCase()) > -1);
			if (retval) console.log("--- "+fullName);
            return retval;
			} else return false;
        });
		results.sort(function(a,b) {
			if (a.ASSET_SN)
			{	
		    var a1=a.ASSET_SN[0];
			console.log(a1);
			var b1=b.ASSET_SN[0];
			if (a1>b1) return 1;
			if (a1<b1) return -1;
			return 0;
			} else return 0;
		});
		console.log("found "+results.length+" results"); 
		//res.render('lv_atleti.ejs',{ posts: results});
        callback(results);
    } else {
        callback(assets);
    }
};

function findById(id,callback) {

	if (!global.loggedin) {
	  res.send("User not logged in");	
	  return;	
	}
    console.log('findAssetsById: ' + id);
	console.log("assets totali: "+locations.length);
    if (id) {
        var results = assets.filter(function(element) {
            var aid = element.ASSET_SN[0];
			//console.log(aid);
			
			if (id==aid) {
			 //console.log("--- "+fullName);
			return true;
			 
			}
            return false;
        });
		console.log("Found "+results.length+" results");
		
        callback(results);
    } else {
        callback(assets);
    }
};


function findAll(callback) {
  dbs.list("installations",function(data){
	 	console.log(JSON.stringify(data));
		
		var htm="";
		data.rows.sort(function(a,b){
			
			var coda=a.doc.name;
            var codb=b.doc.name;
            if (coda>codb) return 1;			
			if (coda<codb) return -1;
			return 0;
		})
		
		htm+='<div class="recnum ui-corner-all " style="text-align: left; left: 20px;">'+data.rows.length+' records</div>';
		for (var j=0; j<data.rows.length; j++)
		{
		 var row=data.rows[j];	
		 htm+='<table border=0 width=100%><tr><td valign=middle width=20 ><div><a class=delitem href="#" id="del'+row.doc._id+'"><img src="img/remove.png" /></a></div></td><td valign="top"><div data-role="collapsible" id="set1" data-collapsed="true" class="insta set1 ui-collapsible ui-collapsible-inset ui-corner-all ui-collapsible-themed-content"><h3 class="insth ui-collapsible-heading ui-collapsible-heading-collapsed">'+row.doc.date+' - '+row.doc.name+'</h3><ul data-role=listview" data-inset="true" class="collaps">';

		 htm+='<li>'+row.doc.items.length+' items</li>';
		 for (var i=0;i<row.doc.items.length; i++)
		 {
		  var rowit=row.doc.items[i];
		  htm+='<li><a href="#">'+rowit.assignee+'<br>'+rowit.tipo+'<br>'+rowit.location+'</a></li>';
		 
		 }
		 htm+='</ul></div></td></tr></table>';
		}
	    callback(htm);
		
		
		
	});  
}

function findSelectAll(callback) {
  dbs.getAllItemsREST("installations",function(data){
	 	console.log(JSON.stringify(data));
		callback(data);
		return;
		
		var htm="";
		data.rows.sort(function(a,b){
			
			var coda=a.doc.name;
            var codb=b.doc.name;
            if (coda>codb) return 1;			
			if (coda<codb) return -1;
			return 0;
		})
		
		//htm+='<div class="recnum ui-corner-all " style="text-align: left; left: 20px;">'+data.rows.length+' records</div>';
		htm+='<ul data-role="listview" data-inset="false" class="collaps">';
		for (var j=0; j<data.rows.length; j++)
		{
		 var row=data.rows[j];	
		// htm+='<table border=0 width=100%><tr><td valign=middle width=20 ><div><a class=delitem href="#" id="del'+row.doc._id+'"><simg src="img/remove.png" /></a></div></td><td valign="top"><div data-role="collapsible" id="set1" data-collapsed="true" class="insta set1 ui-collapsible ui-corner-all ui-collapsible-themed-content"><h3 class="insth ui-collapsible-heading ui-collapsible-heading-collapsed">'+row.doc.date+' - '+row.doc.name+'</h3><ul data-role=listview" data-inset="false" class="collaps">';

		 htm+='<li class="ui-li-static ui-body-inherit ui-first-child ui-last-child"><a id="doc_'+row.doc._id+'" onclick="editInstallation(this)">'+row.doc.name+'</a></li>';
		 for (var i=0;i<row.doc.items.length; i++)
		 {
		  var rowit=row.doc.items[i];
		  //htm+='<li><a href="#">'+rowit.assignee+'<br>'+rowit.tipo+'<br>'+rowit.location+'</a></li>';
		 
		 }
		 
		}
		htm+='</ul>';
	    callback(htm);
		
		
		
	});  
}



function getFeeds(url,callback){
	
console.log("getting feeds from url "+url)	

var format="xml"; 


request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
		
		if (format.trim().toLowerCase()=="xml")
		{
			parser.parseString(body, function (err, result) {
             
		      if (err) {
				  console.log("Error parsing XML: "+err);
				  callback({"error":true,"msg":err.message})
				  return;
				  
			  }
			  
			  callback(result);
			  
			  
		    });
		//console.log(result);
          return;
			
		}
		
		callback(body);
		return;
    }
	if (error)
	{
	 console.log("error reading remote file: "+error.message);
     callback({"error":true,"msg":error.message})
		return;
	}
});
	
	
	
}



function renderHtm(res)
{
 var htm="<ul data-role='listview' />";
 var results = res.filter(function(element) {
   htm+="<li>"+element.cognome+" "+element.nome+"</li>";
 });
 htm+="</ul>";
 return htm;
}


function generateId()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text.toUpperCase();
}


function generateToken(ciphers)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < ciphers; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text.toUpperCase();
}




Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
  };


module.exports = router;

