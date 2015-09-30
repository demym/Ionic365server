var logger;
var Cloudant = require('cloudant');
var url = require('url');
var http = require('http');
var querystring = require("querystring");



/*var username = '2be28457-cba7-449a-a870-b1caa45d9350-bluemix';
var password = '24c7295ad9c99d96d8cbfba3deec7f855de6504866e72c76afc244cabe2c7972';
var CLOUDANT_REST_URL = "2be28457-cba7-449a-a870-b1caa45d9350-bluemix.cloudant.com";*/

var username = '2be28457-cba7-449a-a870-b1caa45d9350-bluemix';
var password = '24c7295ad9c99d96d8cbfba3deec7f855de6504866e72c76afc244cabe2c7972';
var CLOUDANT_REST_URL = "2be28457-cba7-449a-a870-b1caa45d9350-bluemix.cloudant.com";

//var restAuth='Basic ' + Base64.encode(username+":"+password);
var restAuth=new Buffer(username+":"+password).toString("base64");
console.log(restAuth);


function getAllItems(callback) {
	getAllItemsREST(callback);
}

function addItem(obj, callback) {
	console.log("ItemService addItem");
	console.log(JSON.stringify(obj));
	addItemREST(obj, callback);
}

function deleteItem(objId, callback) {
	deleteItemREST(itemId, callback);
}

/*####################### Bluemix Data REST APIs - START #######################*/
function getAllItemsREST(callback) {
	var PATH = "/items/_all_docs?include_docs=true";
	var options = {
		hostname : CLOUDANT_REST_URL,
		port : '80',
		path : PATH,
		method : 'GET',
		headers : {
			 'Authorization': 'Basic MmJlMjg0NTctY2JhNy00NDlhLWE4NzAtYjFjYWE0NWQ5MzUwLWJsdWVtaXg6MjRjNzI5NWFkOWM5OWQ5NmQ4Y2JmYmEzZGVlYzdmODU1ZGU2NTA0ODY2ZTcyYzc2YWZjMjQ0Y2FiZTJjNzk3Mg=='
		},
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
				callback(JSON.parse(resultString));
			} else {
				callback(); // error case
			}
		});
	});
	req.end();
}
function getItemByIdREST(itemId, callback) {
	var PATH = "/items/" + itemId;
	var options = {
		hostname : CLOUDANT_REST_URL,
		port : '80',
		path : PATH,
		method : 'GET',
		headers : {
			
			 'Authorization': 'Basic MmJlMjg0NTctY2JhNy00NDlhLWE4NzAtYjFjYWE0NWQ5MzUwLWJsdWVtaXg6MjRjNzI5NWFkOWM5OWQ5NmQ4Y2JmYmEzZGVlYzdmODU1ZGU2NTA0ODY2ZTcyYzc2YWZjMjQ0Y2FiZTJjNzk3Mg==',
			'Content-Type' : 'application/json'
		},
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
				callback(); // error case
			}
		});
	});
	req.end();
}


function addItemREST(item, callback) {
	

	console.log("######################### addItemREST --> " + JSON.stringify(item));
	var PATH = "/items";
	var options = {
		hostname : CLOUDANT_REST_URL,
		port : '80',
		path : PATH,
		method : 'POST',
		headers : {
			 'Authorization': 'Basic MmJlMjg0NTctY2JhNy00NDlhLWE4NzAtYjFjYWE0NWQ5MzUwLWJsdWVtaXg6MjRjNzI5NWFkOWM5OWQ5NmQ4Y2JmYmEzZGVlYzdmODU1ZGU2NTA0ODY2ZTcyYzc2YWZjMjQ0Y2FiZTJjNzk3Mg==',
			'Content-Type' : 'application/json'
		},
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
			if (res.statusCode === 201) {
				callback(JSON.parse(resultString));
			} else {
				callback(); // error case
			}
		});
	});
	req.write(JSON.stringify(item));
	req.end();
}
function deleteItemREST(itemId, callback) {
	getUserById(itemId, function(obj) {
		var rev = obj._rev;
		var PATH = "/items/" + itemId + "?rev=" + rev;
		var options = {
			hostname : CLOUDANT_REST_URL,
			port : '80',
			path : PATH,
			method : 'DELETE',
			headers : {
			 'Authorization': 'Basic MmJlMjg0NTctY2JhNy00NDlhLWE4NzAtYjFjYWE0NWQ5MzUwLWJsdWVtaXg6MjRjNzI5NWFkOWM5OWQ5NmQ4Y2JmYmEzZGVlYzdmODU1ZGU2NTA0ODY2ZTcyYzc2YWZjMjQ0Y2FiZTJjNzk3Mg==',
				'Content-Type' : 'application/json'
			},
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
					callback(); // error case
				}
			});
		});
		req.end();
	});
}
/*####################### Bluemix Data REST APIs - END #######################*/
exports.getAllItems = getAllItems;
exports.addItem = addItem;
exports.deleteItem = deleteItem;