var express = require('express');
var router = express.Router();
var config = require("../constants.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(config);	
  res.render('index', { title: 'Express' });
});


module.exports = router;
