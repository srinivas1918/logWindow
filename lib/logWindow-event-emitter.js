var socketio = require('socket.io');
var config = require('../constants.js');
var fileWatchManager = require('./fileWatcherManager.js');
var cmd=require('node-cmd');

module.exports.listen = function(server){

		var filesList = []; // holds the files to be displayed.

		var io= socketio.listen(server,{ log: false });

		fileWatchManager.initWatcher(filesList,io);

		io.sockets.on('connection',function(socket) {
		console.log("conneted");
		console.log(filesList);

		joinRoom(socket, config.rooms.defaultRoom, function(){
			io.sockets.emit("LOG-FILES-LIST", {filesList: filesList});
		});
		
		roomChangeListener(fileWatchManager, socket);
		registerCommandListener(socket);
	});	

}

var joinRoom = function(socket, room, cb){
	socket.join(room);
	if( typeof cb == 'function')
		cb();
};

var leaveRoom = function(socket, room, cb){
	socket.leave(room);

	if( typeof cb == 'function')
		cb();
}

// On RoomChange
var roomChangeListener = function(fileWatchManager, socket){
	
	socket.on("ROOM-CHANGE", function(roomDetails){
		console.log("ROOM-CHANGE", roomDetails);

		if(roomDetails.oldRoom != null){
			console.log("leaveRoom ", roomDetails.oldRoom)
			leaveRoom(socket, roomDetails.oldRoom); // leaves the old room
		};
		
		if(roomDetails.oldRoom != roomDetails.currentRoom && roomDetails.currentRoom != null){
			console.log("joinRoom", roomDetails.currentRoom);
			joinRoom(socket, roomDetails.currentRoom);
		}
			
	});
}

var registerCommandListener = function(socket){
	socket.on("CMD-SENT", function(commandObj){
		var exec = require('child_process').exec;
		exec(commandObj.cmd, {
		  cwd: config.logFile
		}, function(error, stdout, stderr) {
		
		  if(error){
		  	 socket.emit("CMD-RESULT", {result:error});
		  }

		  if(stderr){
		  	socket.emit("CMD-RESULT", {result:stderr});
		  }

		  if(stdout){
		  	socket.emit("CMD-RESULT", {result:stdout});
		  }
		  
		});


	})
}