/**
*   @Author : Nalla Srinivas
*   @Desc   : --
*/
var config = require('../constants.js');
const fs = require('fs');
var chokidar = require('chokidar');
var path = require('path');
var LineByLineReader = require('line-by-line');

var FileWatchMananger = function(){
	
}

FileWatchMananger.prototype.initWatcher = function(fileList, io){
	var watcher = chokidar.watch(config.logBaseDir, {ignored: /^\./, persistent: true});

	watcher.on('add', function(file) {
  		console.log('File', path.basename(file), 'has been added');
  		fileList.push(path.basename(file));
  		var usersInRoom= io.sockets.clients(config.rooms.defalutRoom);
  		console.log("usersInRoom :",usersInRoom.length)
  		if(usersInRoom.length > 0){
  			io.sockets.in(config.rooms.defalutRoom).emit("LOG-FILES-LIST", {filesList: fileList});
  		}
  	})
  .on('change', function(file) {
  	console.log('File', file, 'has been changed');
    console.log("File content modified",  path.basename(file));
    var usersInRoom= io.sockets.clients(path.basename(file));
    console.log("User in the room "+path.basename(file)+"are "+usersInRoom.length);
    io.sockets.in(path.basename(file)).emit('FILE-CHANGE', {file: path.basename(file), permission:"change"});
  })
  .on('unlink', function(file) {
  	console.log('File', file, 'has been removed');
   var index = fileList.indexOf(path.basename(file));
   if (index > -1) {
      fileList.splice(index, 1);
    }

    io.sockets.in(config.rooms.defalutRoom).emit("LOG-FILES-LIST", {filesList: fileList});
    io.sockets.in(path.basename(file)).emit("FILE-CHANGE",{file:path.basename(file), permission:"removed"});

  })
  .on('error', function(error) {
  	console.error('Error happened', error);
  });
}


module.exports = new FileWatchMananger();
