var socket= io.connect();
var oldRoom = null;
var currentRoom = null;
var lineInc =0;
var max = 100;
var currentFile = null;
function divEscapedContentElement(message){
		return $('<div></div>').html('<a href="javascript:void(0)" onclick="setWindowFrame(&apos;'+message+'&apos;)">'+message+'</a>');
}
function divSystemContentElement(message){
		return $('<div></div>').html('<i>'+ message + '</i>');
}
function divContent(message){
		return $('<div style="margin-left:25px;"></div>').text(message);
}
function addLogMessage(message, number){
	return $('<div></div>').text(number+" : "+message.line);
}

function displayFileInfo(fileName){
	return $('<div></div>').html('You are viewing the file :'+fileName+' <a href="javascript:void(0)" onclick="fileDownload()">Download</a>');
}

function addFile(message){
	return $('<li class="list-group-item"></li>').html('<a href="javascript:void(0)" onclick="setWindowFrame(&apos;'+message+'&apos;)">'+message+'</a>');
}

var  fileDownload = function(){
	console.log("oldRoom", currentFile)
	window.open("download?file="+currentFile+"&isDefault=false", "_blank")
	}

var setWindowFrame = function(currentRoom){
	$("#cmd").hide();
		$("#liveInfo").html('');
		$('#liveInfo').hide();
		$("#room").show();
		$("#messages").show();
		currentFile = currentRoom;
		socket.emit("ROOM-CHANGE", {oldRoom: oldRoom, currentRoom:currentRoom, type:'logwindow'});
		oldRoom = currentRoom;
		$("#lineInfo").html(displayFileInfo(currentRoom));

		$("#fileBrowser").attr('src', "file?file="+currentRoom+"&isDefault=false");  
	}
var resetWindow = function(fileName){
	$("#fileBrowser").attr('src', "file?file="+fileName+"&isDefault=false");
	$("#liveInfo").html(''); 
	$('#liveInfo').hide();
}

$(document).ready(function(){
    $("#room").hide();
    $("#cmd").hide();
    $('#liveInfo').hide();
	socket.on("LOG-FILES-LIST", function(data){
		console.log(data);
		$('#room-list').empty();
			data.filesList.forEach(function(file){
				if( file != ''){
					$('#room-list').append(addFile(file));
				}
			});
			
	});

	socket.on('FILE-CHANGE', function(data){
		console.log("file change", data.file);
		$('#liveInfo').show();
		if(data.permission == 'change')
		$("#liveInfo").html(data.file+" has been modified. Please <a href='javascript:void(0);' onclick='resetWindow(&apos;"+data.file+"&apos;)'>click here</a> to reload");
		else
		$("#liveInfo").html(data.file+" has been removed or renamed.");	
	});

	$("#execute").on("click", function(){
		console.log("execute");
		console.log("oldRoom", oldRoom);
		if(oldRoom != null)
			socket.emit("ROOM-CHANGE", {oldRoom: oldRoom, currentRoom:currentFile, type:'logwindow'});
		$("#messages").hide();
		$("#room").hide();

		$("#cmd").show();

		var cmd = $("#commandBox").val();
		if(cmd != null && cmd.length > 0 ){
			$("#cmd").append(divSystemContentElement("You : "+cmd));
			$("#commandBox").val("");
			$("#commandBox").focus();
			socket.emit("CMD-SENT", {cmd:cmd});
		}
	});

	socket.on("CMD-RESULT", function(data){
		$("#cmd").append(divSystemContentElement("System : "));
		var sysresult = data.result;
		
		var lines = sysresult.split('\n');
		for(var i = 0;i < lines.length;i++){
		    $("#cmd").append(divContent(lines[i]));
		}
		
	});


});
