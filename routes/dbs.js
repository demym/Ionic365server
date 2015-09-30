var express = require('express');
var fs = require('fs')
var router = express.Router();
//var nano=require('nano')('2be28457-cba7-449a-a870-b1caa45d9350-bluemix.cloudant.com');
var Cloudant = require('cloudant');
var http = require('http');
var username = 'cdf8a0ef-8440-4070-b202-b4917838e42f-bluemix';
var host=username+".cloudant.com";
var password = '44c5f59d97d988269ddf2007661d41b5828ab5761f786ca8458dbc2b00f0c2a7';
var CLOUDANT_REST_URL = "cdf8a0ef-8440-4070-b202-b4917838e42f-bluemix.cloudant.com";
var url="https://cdf8a0ef-8440-4070-b202-b4917838e42f-bluemix:44c5f59d97d988269ddf2007661d41b5828ab5761f786ca8458dbc2b00f0c2a7@cdf8a0ef-8440-4070-b202-b4917838e42f-bluemix.cloudant.com"

var headers = {
			'Authorization': 'Basic MmJlMjg0NTctY2JhNy00NDlhLWE4NzAtYjFjYWE0NWQ5MzUwLWJsdWVtaXg6MjRjNzI5NWFkOWM5OWQ5NmQ4Y2JmYmEzZGVlYzdmODU1ZGU2NTA0ODY2ZTcyYzc2YWZjMjQ0Y2FiZTJjNzk3Mg==',
			'Content-Type' : 'application/json'
		};

		/*
Cloudant({
        "username": "2be28457-cba7-449a-a870-b1caa45d9350-bluemix",
        "password": "24c7295ad9c99d96d8cbfba3deec7f855de6504866e72c76afc244cabe2c7972",
        "host": "2be28457-cba7-449a-a870-b1caa45d9350-bluemix.cloudant.com",
        "port": 443,
        "url": "https://2be28457-cba7-449a-a870-b1caa45d9350-bluemix:24c7295ad9c99d96d8cbfba3deec7f855de6504866e72c76afc244cabe2c7972@2be28457-cba7-449a-a870-b1caa45d9350-bluemix.cloudant.com"
      }, function(er, cloudant) {
  if (er)
    return console.log('Error connecting to Cloudant account %s: %s', username, er.message)
  
	  console.log('Connected to %s:', username);
  
});
*/

function list(dbname,callback)
{
  Cloudant({
        "username": username,
        "password": password,
        "host": host,
        "port": 443,
        "url": url
      }, function(er, cloudant) {
		    if (er)
			{
             callback({error: "true", msg: er.message});   
             return console.log('Error connecting to Cloudant account %s: %s', username, er.message)	  
            } 
		    var db = cloudant.db.use(dbname);
			db.list({ include_docs: true},function(err, body) {
			  if (!err) {
			   //console.log("db.list results: "+JSON.stringify(body)); 
			   callback(body);
              } else
              {
	           console.log("list db error");
	           callback({error: "true", msg: "messaggio"});
              }
     		})	
        });	
	
	
}

function listById(dbname,id,callback)
{
	console.log("DBSListById dbanem: "+dbname+" - id: "+id)
 var result={ rows:[]};	
  Cloudant({
        "username": username,
        "password": password,
        "host": host,
        "port": 443,
        "url": url
      }, function(er, cloudant) {
		    if (er)
			{
             callback({error: "true", msg: er.message});   
             return console.log('Error connecting to Cloudant account %s: %s', username, er.message)	  
            } 
		    var db = cloudant.db.use(dbname);
			db.list({ include_docs: true},function(err, body) {
			  if (!err) {
			   //console.log("db.list results: "+JSON.stringify(body)); 
			   
			   for (var i=0; i<body.rows.length; i++)
			   {
				 var docid=body.rows[i].doc._id;
                 if (docid==id) result.rows.push(body.rows[i]);				 
				   
			   }
			   
			   
			   callback(result);
              } else
              {
	           console.log("list db error");
	           callback({error: "true", msg: err.message});
              }
     		})	
        });	
	
	
}


function listByField(dbname,field,value,callback)
{
	console.log("DBSListByField dbanem: "+dbname+" - field: "+field+" with value: "+value)
 var result={ rows:[]};	
  Cloudant({
        "username": username,
        "password": password,
        "host": host,
        "port": 443,
        "url": url
      }, function(er, cloudant) {
		    if (er)
			{
             callback({error: "true", msg: er.message});   
             return console.log('Error connecting to Cloudant account %s: %s', username, er.message)	  
            } 
		    var db = cloudant.db.use(dbname);
			db.list({ include_docs: true},function(err, body) {
			  if (!err) {
			   //console.log("db.list results: "+JSON.stringify(body)); 
			   
			   for (var i=0; i<body.rows.length; i++)
			   {
				 var docid=body.rows[i].doc._id;
				 var valorcampo=body.rows[i].doc[field];
                 if (valorcampo==value) result.rows.push(body.rows[i]);				 
				   
			   }
			   
			   
			   callback(result);
              } else
              {
	           console.log("list db error");
	           callback({error: "true", msg: err.message});
              }
     		})	
        });	
	
	
}



function listrest(dbname,callback)
{
  getAllItemsREST(dbname,function(data){
	 	console.log("db.list results: "+JSON.stringify(data));
		callback(data);
		
	});  	
}




function insert(dbname,obj,callback)
{
 Cloudant({
        "username": username,
        "password": password,
        "host": host,
        "port": 443,
        "url": url
      }, function(er, cloudant) {
  if (er)
  {
  
  callback({error: "true", msg: er.message});   
   return console.log('Error connecting to Cloudant account %s: %s', username, er.message)	  
  } 
  
	  console.log('Connected to %s:', username);
	  var db = cloudant.db.use(dbname);
      db.insert(obj, function(err, body) {
  if (!err) {
	  console.log(body); 
	  callback(body);
  } else
  {
	  console.log("insert db error");
	  callback({error: "true", msg: er.message});
  }
    
 });	
  
});	
 
	
}


function update(dbname,obj,callback)
{
 var rev=obj._rev;	
 var id=obj._id;
 obj._rev=rev;
 Cloudant({
        "username": username,
        "password": password,
        "host": host,
        "port": 443,
        "url": url
      }, function(er, cloudant) {
  if (er)
  {
  
  callback({error: "true", msg: er.message});   
   return console.log('Error connecting to Cloudant account %s: %s', username, er.message)	  
  } 
  
	  console.log('Connected to %s:', username);
	  var db = cloudant.db.use(dbname);
	  console.log("trying to update document "+id+" with rev "+rev);
      db.insert(obj, id,function(err, body) {
  if (!err) {
	  console.log(body); 
	  callback(body);
  } else
  {
	  console.log("update db error");
	  callback({error: "true", msg: err.message});
  }
    
 });	
  
});	
 
	
}

function remove(dbname,doc,callback)
{
 Cloudant({
        "username": username,
        "password": password,
        "host": host,
        "port": 443,
        "url": url
      }, function(er, cloudant) {
  if (er)
  {
   callback(er);	  
   return console.log('Error connecting to Cloudant account %s: %s', username, er.message)	  
  } 
  
	  console.log('Connected to %s:', username);
	  var db = cloudant.db.use(dbname);
      db.destroy(doc.id, doc.rev, function(err, body) {
  if (!err) {
	  console.log(body); 
	  callback(body);
  } else
  {
	  console.log("remove db error");
	  callback({error: "true", msg: err.message});
  }
    
 });	
  
});	
 
	
}


//DB functions

//GETALLITEMS


function getAllItemsREST(dbname,callback) {
	var PATH = "/"+dbname+"/_all_docs?include_docs=true";
	var options = {
		hostname : CLOUDANT_REST_URL,
		port : '80',
		path : PATH,
		method : 'GET',
		headers : headers,
		rejectUnauthorized : false,
		agent : false,
	};
	var req = http.request(options, function(res) {
		var resultString = '';
		res.on('data', function(chunk) {
			console.log('get response: ' + chunk);
			resultString += chunk;
		});
		res.on('error', function(c) {
			console.log('get error: ' + c);
		});
		res.on('end', function() {
			console.log('get status ' + res.statusCode);
			if (res.statusCode === 200) {
				//console.log("got following response: "+JSON.parse(resultString))
				callback(JSON.parse(resultString));
			} else {
				callback({error: "true", statusCode: res.statusCode}); // error case
			}
		});
		
	});
	req.on('error',function(err){
      console.log("req error: "+err);
	  callback({error: "true", msg: err.message});
    });

	req.end();
}


//GETITEMBYID


function getItemByIdREST(dbname, itemId, callback) {
	var PATH = "/"+dbname+"/" + itemId;
	var options = {
		hostname : CLOUDANT_REST_URL,
		port : '80',
		path : PATH,
		method : 'GET',
		headers : headers,
		rejectUnauthorized : false,
		agent : false,
	};
	var req = http.request(options, function(res) {
		var resultString = '';
		res.on('data', function(chunk) {
			//console.log('get response: ' + chunk);
			resultString += chunk;
		});
		res.on('error', function(c) {
			console.log('get error: ' + c);
		});
		res.on('end', function() {
			console.log('get status ' + res.statusCode);
			if (res.statusCode === 200) {
				callback(JSON.parse(resultString));
			} else {
				callback({error: "true", statusCode: res.statusCode}); 
			}
		});
	});
	req.on('error',function(err){
      console.log("req error: "+err);
	    callback(err);
    });

	req.end();
}


//ADDITEM


function addItemREST(dbname, item, callback) {
	

	console.log("dbs addItemREST to db "+dbname+" --> " + JSON.stringify(item));
	var PATH = "/"+dbname;
	var options = {
		hostname : CLOUDANT_REST_URL,
		port : '80',
		path : PATH,
		method : 'POST',
		headers : headers,
		rejectUnauthorized : false,
		agent : false,
	};
	var req = http.request(options, function(res) {
		//console.log("httpreq: "+JSON.stringify(res))
		//res.setEncoding('utf8');
		var resultString = '';
		res.on('data', function(chunk) {
			console.log('ondata: ' + chunk);
			resultString += chunk;
		});
		res.on('error', function(e) {
			  console.log("Error: " +  e.message); 
              console.log( e.stack );
			  //callback({"error": e.message});
		});
		res.on('end', function() {
			console.log('get status ' + res.statusCode);
			if (res.statusCode === 201) {
				callback(JSON.parse(resultString));
			} else {
				callback(JSON.parse(resultString));// error case
			}
		});
	});
	req.on('error',function(err){
      console.log("req error: "+err);
	  callback(err);
    });
    req.end();
	//req.write(JSON.stringify(item));
	//req.end();
}


//DELETEITEM


function deleteItemREST(dbname, itemId, rev, callback) {
	getItemByIdREST(dbname,itemId, function(obj) {
		
		var PATH = "/"+dbname+"/" + itemId + "?rev=" + rev;
		//var PATH = "/installations/" + itemId ;
		var options = {
			hostname : CLOUDANT_REST_URL,
			port : '80',
			path : PATH,
			method : 'DELETE',
			headers :headers,
			rejectUnauthorized : false,
			agent : false,
		};
		var req = http.request(options, function(res) {
			var resultString = '';
			res.on('data', function(chunk) {
				//console.log('get response: ' + chunk);
				resultString += chunk;
			});
			res.on('error', function(c) {
				console.log('get error: ' + c);
			});
			res.on('end', function() {
				console.log('get status ' + res.statusCode);
				if (res.statusCode === 200) {
					callback(JSON.parse(resultString));
				} else {
					callback({error: "true", statusCode: res.statusCode}); 
				}
			});
		});
		req.end();
	});
}



function insertAttach(dbname,obj,callback) {
	 Cloudant({
        "username": username,
        "password": password,
        "host": host,
        "port": 443,
        "url": url
      }, function(er, cloudant) {
		    if (er)
			{
             callback({error: "true", msg: er.message});   
             return console.log('Error connecting to Cloudant account %s: %s', username, er.message)	  
            } 
	
	//console.log("received insertAttach for object "+JSON.stringify(obj));
    
	var pth=obj.path;
	var fname=obj.fname;
	var filedata=obj.data;
	delete obj["data"];
	console.log("uploaded as "+pth)
	//obj.data="";
	//callback(obj);
	
 
	 
	var db = cloudant.db.use(dbname);
	
	 db.insert(obj, function(err, body) {
  if (!err) {
	  console.log("inserted record "+JSON.stringify(body));
	  
    /*
	  var img_stream = fs.createReadStream(pth)
      var att = db.attachment.insert(body.id, fname, null, 'image/png')
 
     img_stream.pipe(att)
	 */
	//console.log(img_stream);
	//console.log("file streamed into record");
	callback(body);
	return;
	  
	/*   
	  db.attachment.insert(body.id, fname, filedata, 'image/png',
      { rev: body.rev}, function(err, body) {
        if (!err) {
			console.log("inserted attachment succesfully")
			callback(body);
			return;
		}  else {
			  console.log("insert attachment error");
	          callback({error: "true", msg: err.message});
			 return;
		}
	
     })
	 */
  } else
  {
	  console.log("insert db error");
	  callback({error: "true", msg: er.message});
  }
    
 });	
	
	
	
	/*
	db.multipart.insert(obj, attachments, 'rabbit', function(err, body) {
      if (!err)
	  {	  
        console.log(body);
	    callback(body)
	  }	else callback(body)
    })
*/
	  });
}



function listObjects(cobj,callback){

    var dbname=cobj.dbname;
	var field=cobj.field;
	var value=cobj.value;
	
	value=value.trim().toLowerCase();
	
	var cdata={ rows: []};
	
	//console.log(JSON.stringify(req.body));
	
	
	list(dbname,function(data){
		
		if (data.rows) {
			
			
			
		
		
		for (var i=0; i<data.rows.length; i++) {
			
			var doc=data.rows[i].doc;
			if (doc[field])
			{
			 var id=doc[field].toLowerCase().trim();
			 if (id.indexOf(value)>-1){
				cdata.rows.push(data.rows[i])
			 }
				
			}
			 
			
			
			
		}
		//console.log("list result: "+JSON.stringify(data))
		
		cdata.total_rows=cdata.rows.length;
		callback(cdata)
		//res.send(cdata);
		} else {
			
		  console.log("no data.rows found")	
		  callback(cdata)	
		}
	})
	
	
}


exports.insertAttach=insertAttach;
exports.list=list;
exports.listById=listById;
exports.listByField=listByField;
exports.listObjects=listObjects;
exports.listrest=listrest;
exports.update=update;
exports.remove=remove;
exports.insert=insert;
exports.addItemREST=addItemREST;
exports.getAllItemsREST=getAllItemsREST;
exports.deleteItemREST=deleteItemREST;
exports.getItemByIdREST=getItemByIdREST;