var socketio= require('socket.io');
var io;

exports.listen = function(socketServer){
	console.log("listen");
	io = socketio.listen(socketServer,{ log: false });
	io.set('loglevel',1);
	io.sockets.on('connection',function(socket) {
				console.log("ON connection");
					});
	
}

