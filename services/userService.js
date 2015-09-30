var logger;
var Cloudant = require('cloudant');
var url = require('url');
var http = require('http');
var querystring = require("querystring");

/*var username = 'f09d19bb-d007-43ad-90c2-4606b91464f6-bluemix';
var password = 'e96bc6a311c4ac8197d68e628f3a736de16da857f00ed3f7301292e49da53dcb';
var CLOUDANT_REST_URL = "f09d19bb-d007-43ad-90c2-4606b91464f6-bluemix.cloudant.com";*/

var username = '2be28457-cba7-449a-a870-b1caa45d9350-bluemix';
var password = '24c7295ad9c99d96d8cbfba3deec7f855de6504866e72c76afc244cabe2c7972';
var CLOUDANT_REST_URL = "2be28457-cba7-449a-a870-b1caa45d9350-bluemix.cloudant.com";


var cloudant_db;
Cloudant({account:username, password:password}, function(err, cloudant) {
	console.log('Connected to Cloudant');
	cloudant_db = cloudant;
	cloudant_db.db.list(function(err, all_dbs) {
		console.log('All my databases: %s', all_dbs.join(', '));
	});
});

function getAllUsers(callback) {
	/* ------- USING CLOUDANT REST APIs - START -------*/
	getAllUsersREST(callback);
	/* ------- USING CLOUDANT REST APIs - END -------*/
	/* ####### USING CLOUDANT DB APIs - START #######*/
	/*var usersDb = cloudant_db.use('users');
	usersDb.list(function(err, body) {
		if (!err) {
			callback(body);
		}
	});*/
	/* ####### USING CLOUDANT DB APIs - END #######*/
}
function getUserById(userId, callback) {
	/* ------- USING CLOUDANT REST APIs - START -------*/
	getUserByIdREST(userId, callback);
	/* ------- USING CLOUDANT REST APIs - END -------*/
	/* ####### USING CLOUDANT DB APIs - START #######*/
	
	/* ####### USING CLOUDANT DB APIs - END #######*/
}
function addUser(user, callback) {
	/* ------- USING CLOUDANT REST APIs - START -------*/
	addUserREST(user, callback);
	/* ------- USING CLOUDANT REST APIs - END -------*/
	/* ####### USING CLOUDANT DB APIs - START #######*/
	/*console.log('==================== USER SERVICE = ' + JSON.stringify(user));
	var usersDb = cloudant_db.use('users');
	usersDb.insert({ name: user.attributes.name, age:user.attributes.age, location:user.attributes.location}, 'YYY', function(err, body) {
		if (!err)
			console.log(body);
	});*/
	/* ####### USING CLOUDANT DB APIs - END #######*/
	
}
function deleteUser(userId, callback) {
	/* ------- USING CLOUDANT REST APIs - START -------*/
	deleteUserREST(userId, callback);
	/* ------- USING CLOUDANT REST APIs - END -------*/
	/* ####### USING CLOUDANT DB APIs - START #######*/
	
	/* ####### USING CLOUDANT DB APIs - END #######*/
}
/*####################### Bluemix Data REST APIs - START #######################*/
function getAllUsersREST(callback) {
	var PATH = "/users/_all_docs?include_docs=true";
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
function getUserByIdREST(userId, callback) {
	var PATH = "/users/" + userId;
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
function addUserREST(user, callback) {
	var PATH = "/users";
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
	req.write(JSON.stringify(user));
	req.end();
}
function deleteUserREST(userId, callback) {
	getUserById(userId, function(obj) {
		var rev = obj._rev;
		var PATH = "/users/" + userId + "?rev=" + rev;
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
exports.getAllUsers = getAllUsers;
exports.addUser = addUser;
exports.deleteUser = deleteUser;