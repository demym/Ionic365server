var express = require('express');
var router = express.Router();
var itemServices = require('../services/itemService');

/* GET items root resource. */
router.get('/', function(req, res) {
	res.send('respond with a resource');
});

/* GET all items. */
router.get('/getAllItems', function(req, res) {
	itemServices.getAllItems(function(obj) {
		res.json(obj);
	});
});

/* ADD items. */
router.post('/addItem', function(req, res) {
	console.log("Cloudant addItem");
	itemServices.addItem(req.body, function(obj) {
		res.json(obj);
	});
});

/* DELETE items by ID. */
router.post('/deleteItem', function(req, res) {
	var objId = req.body.objId;
	itemServices.deleteItem(objId, function(obj) {
		res.json(obj);
	});
});

module.exports = router;