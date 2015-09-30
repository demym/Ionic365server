var express = require('express');
var router = express.Router();
var Cloudant = require('cloudant');
var http = require('http');
var dbs=require("../routes/dbs");

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

router.post('/', function(req, res) {
 //console.log(req);	
  console.log(JSON.stringify(req.body));
  console.log(req.files);
  
  var fname="";
  var path="";
  
  if (req.files.fileattach) {
		if (req.files.fileattach.originalfilename) fname=req.files.fileattach.originalfilename;
		if (req.files.fileattach.path) path=req.files.fileattach.path;
  }		
  var data="";
    
	//	fs.readFile(path, function(err, data) {
//			if (!err) {
//				var img = {name: fname, content_type:'image/png', data:data}
	//			var attachments = [img] // An array with one attachment, the rabbit image 
//			}
	var obj={
		"titolo":req.body.titolo,
		"nome":"devitello",
		"category": req.body.doccategory,
		"path": path,
		"fname": fname,
		"data": data,
		"url": req.body.url,
		"shareusers": req.body.shareusers,
		"createddate": req.body.createddate
		/*"attachments":attachments*/
	}
	
	
	
	dbs.insertAttach("elibrary",obj,function(idata){
		 res.send(idata);
		
	}) 
  

  
  
});


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


router.get('/listcalendarevents', function(req, res) {
	
	
	//console.log(JSON.stringify(req.body));
	
	
	dbs.list("eventcalendar",function(data){
		
		console.log("list result: "+JSON.stringify(data))
		res.send(data);
		
	})
   
});

router.get('/listusers', function(req, res) {
	
	
	//console.log(JSON.stringify(req.body));
	
	
	dbs.list("users",function(data){
		
		console.log("list result: "+JSON.stringify(data))
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
  dbs.getAllItemsREST("installations",function(data){
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

Date.prototype.yyyymmdd = function() {
   var yyyy = this.getFullYear().toString();
   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   var dd  = this.getDate().toString();
   return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
  };


module.exports = router;

