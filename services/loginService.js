

var fs = require('fs'),
    xml2js = require('xml2js');

	
var users;	
	
var parser = new xml2js.Parser();
var fname="users.xml";

//var atleti = loadJSONfile(__dirname + '/atleti.json');
//console.log(atleti.length);


fs.readFile(fname, "utf-8",function(err, data) {
   console.log("Read file "+fname);
   //atleti=xmlToJson(data);
   //console.log(atleti);
   //atleti =  JSON.parse(data, 'utf8');
   //console.log('Read file atleti.json: '+atleti.length);
   
   //console.log(data);
   //console.log(data);

   
    parser.parseString(data, function (err, result) {
        //console.log(JSON.stringify(result));
		if (err) console.log("Error parsing XML: "+err);
		//console.log(result);
		
		users=result.users.user;
		console.log("Loaded "+result.users.user.length+" users");
		//atleti=result;
		//console.log(employees);
        //console.log('Read file atleti.xml: '+atleti.length);
    });
});


function checkLogin(obj, callback) {
	/* ------- USING CLOUDANT REST APIs - START -------*/
	console.log("loginService checkLogin "+JSON.stringify(obj));
	
	
	 var uid = obj.uid;
	 var psw =  obj.psw;
    console.log('users checkLogin=' + uid+" "+psw);
    if (uid) {
		var found=false;
        var results = users.filter(function(element) {
            var u = element.uid;
			var p = element.psw; 
			//console.log(fullName);
			if  ((u==uid) && (p==psw)) found=true;
            return true;
        });
		
		//console.log("found "+results.length+" results"); 
		
		var result={
			loggedin: found 
		};
		console.log("Userid "+uid+" loggedin: "+found);
		global.loggedin=found;
		global.userid=uid;
		callback(result);
		//req.session.loggedin=found;
		//res.send(result); 
        //res.send(results);
    } else {
       // res.send(atleti);
	   callback(result);
    }
	//req.write("checklogin");
	
	/*------ USING CLOUDANT REST APIs - END -------*/
	/* ####### USING CLOUDANT DB APIs - START #######*/
	
	/* ####### USING CLOUDANT DB APIs - END #######*/
}

exports.findByName = function (req, res, next) {
    var nome = req.params.nome;
    console.log('atleti findByName=' + nome);
    if (nome) {
        var results = users.filter(function(element) {
            var fullName = element.cognome + " " + element.nome;
			//console.log(fullName);
			var retval=(fullName.toLowerCase().indexOf(nome.toLowerCase()) > -1);
			if (retval) console.log("--- "+fullName);
            return retval;
        });
		results.sort(function(a,b) {
		    var a1=a.cognome;
			console.log(a1);
			var b1=b.cognome;
			if (a1>b1) return 1;
			if (a1<b1) return -1;
			return 0;
		});
		console.log("found "+results.length+" results"); 
		res.render('lv_atleti.ejs',{ posts: results});
        //res.send(results);
    } else {
        res.send(atleti);
    }
};


function logOut(callback)
{
	global.loggedin=false;
	console.log("User "+global.userid+ " logged out");
	global.userid="";
	callback({loggedin: false});
};	


exports.findById = function (req, res, next) {
    var id = req.params.id;
	
    console.log('findAtletaById: ' + id);
	console.log("atleti totali: "+users.length);
    if (id) {
        var results = users.filter(function(element) {
            var aid = element.id;
			//console.log(aid);
			var fullName=element.cognome+" "+element.nome;
			if (id==aid) {
			 console.log("--- "+fullName);
			return true;
			 
			}
            return false;
        });
		console.log("Found "+results.length+" results");
		
        res.send(results);
    } else {
        res.send(atleti);
    }
};


exports.findAll = function (req, res, next) {
    console.log('atleti findAll');
    var id = req.params.id;
	users.sort(function(a,b) {
		    var a1=a.cognome[0];
			//console.log(a1);
			var b1=b.cognome[0];
			if (a1>b1) return 1;
			if (a1<b1) return -1;
			return 0;
		});
		res.render('lv_atleti.ejs',{ posts: atleti});
   // res.send(atleti);
};

function loadJSONfile (filename, encoding) {
	try {
		// default encoding is utf8
		if (typeof (encoding) == 'undefined') encoding = 'utf8';
		
		// read file synchroneously
		var contents = fs.readFileSync(filename, encoding);
		
		console.log(contents);

		// parse contents as JSON
		//return JSON.parse(contents);
		return contents
		
	} catch (err) {
		// an error occurred
		throw err;	
	}
} // loadJSONfile


// Changes XML to JSON
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
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


exports.checkLogin = checkLogin;
exports.logOut = logOut;
