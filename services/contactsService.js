

var fs = require('fs'),
    xml2js = require('xml2js');

	
var contacts;	
	
var parser = new xml2js.Parser();
var fname="a_contacts.xml";

//var atleti = loadJSONfile(__dirname + '/atleti.json');
//console.log(atleti.length);


fs.readFile(fname, "utf-8",function(err, data) {
   console.log("Read file "+fname);

   
    parser.parseString(data, function (err, result) {
        //console.log(JSON.stringify(result));
		if (err) console.log("Error parsing XML: "+err);
		//console.log(result);
		
		contacts=result.NewDataSet.record;
		console.log("Loaded "+contacts.length+" locations");
		//atleti=result;
		//console.log(employees);
        //console.log('Read file atleti.xml: '+atleti.length);
    });
});




function findAll(callback)
{
  console.log('contactsService findAll');
 console.log("global loggedin: "+global.loggedin);
	if (!global.loggedin) {
	 callback({"error":"User not logged in"});	
	  return;	
	}
	//callback({'errore':'non funziono'});
	//eturn;
    //var id = req.params.id;
	/*
	contacts.sort(function(a,b) {
		    var a1=a.LAST_NAME[0];
			//console.log(a1);
			var b1=b.LAST_NAME[0];
			if (a1>b1) return 1;
			if (a1<b1) return -1;
			return 0;
		});
		*/
		//res.render('lv_atleti.ejs',{ posts: atleti});
       callback(contacts);	
	
}




exports.findAll = findAll;

