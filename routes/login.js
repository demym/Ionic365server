var express = require('express');
var router = express.Router();



/* GET items root resource. */
router.get('/', function(req, res){
	console.log("called login")
	res.send("ma vaffanculo");
  //res.render('loginsocial', { user: req.user });
});



module.exports = router;