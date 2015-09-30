

var fs = require('fs'),
    xml2js = require('xml2js');

	
var assets;	
	
var parser = new xml2js.Parser();
var fname="a_assets.xml";

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
		
		assets=result.NewDataSet.record;
		console.log("Loaded "+assets.length+" locations");
		//atleti=result;
		//console.log(employees);
        //console.log('Read file atleti.xml: '+atleti.length);
    });
});



function findAll(callback)
{
  console.log('assets findAll');
 console.log("global loggedin: "+global.loggedin);
	if (!global.loggedin) {
	 callback({"error":"User not logged in"});	
	  return;	
	}
    //var id = req.params.id;
	assets.sort(function(a,b) {
		    var a1=a.ASSET_SN;
			//console.log(a1);
			var b1=b.ASSET_SN;
			if (a1>b1) return 1;
			if (a1<b1) return -1;
			return 0;
		});
		//res.render('lv_atleti.ejs',{ posts: atleti});
       callback(assets);	
	
}




exports.findAll = findAll;

