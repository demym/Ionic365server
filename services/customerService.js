var url = require('url');
var http = require('http');
var querystring = require("querystring");

var CUSTOMERS_BASE_REST_URL = "cloudknow-italy-web.mybluemix.net";
var PATH = "/jaxrs/clients/getClientsByProv";

function getCustomersByProv(prov, callback) {
	console.log("hostname = " + CUSTOMERS_BASE_REST_URL);
	console.log("path = " + PATH + '/' + encodeURIComponent(prov));
	var get_options = {
		hostname : CUSTOMERS_BASE_REST_URL,
		port : '80',
		path : PATH + '/' + encodeURIComponent(prov),
		method : 'GET',
		headers : {
			'Content-Type' : 'application/json'
		},
		rejectUnauthorized : false,
		agent : false,
	};
	var get_req = http.request(get_options, function(res) {
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
	get_req.end();
}

exports.getCustomersByProv = getCustomersByProv;