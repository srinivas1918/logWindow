
var express = require('express');
var app = express();
var http = require('http').Server(app);
var config = require('./constants.js');
var path = require('path');
var logWindowEventEmitter = require('./lib/logWindow-event-emitter');

//require('./lib/test');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
//app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.get('/', function(req, res){

  res.sendFile(__dirname + '/index2.html');
});

app.get('/file', function(req, res){
 console.log("Parem", req.query)
 if(req.query.isDefault == 'true')
 	res.sendFile(__dirname + '/sample.log');

   else{
   	 res.sendFile(config.logBaseDir + '/'+req.query.file);
   }
});

app.get('/download', function(req, res){
 
  res.download(config.logBaseDir + '/'+req.query.file); // Set disposition and send it.
});

var server = http.listen(3000, function(){
  console.log('listening on *:3000');
});

logWindowEventEmitter.listen(server);





