var express = require('express');
var router = express.Router();
var customerService = require("../services/customerService");

/* GET customers listing */
router.get('/customersByProv/:prov', function(req, res) {
	var province = req.params.prov;
	customerService.getCustomersByProv(province, function(wxsres) {
		res.json(wxsres);
	});
});

module.exports = router;