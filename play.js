var events = require('events');
var emitter = new events.EventEmitter();

// Get the Client and connect
var mpd = require('mpd'),
    cmd = mpd.cmd;
var client = mpd.connect({
  port: 6600,
  host: 'localhost',
});
client.on('ready', function() {
  console.log("We are ready to receive music");
  emitter.emit("ready");
});
client.on('system', function(name) {
  console.log("update", name);
});
client.on('system-player', function() {
  client.sendCommand(cmd("status", []), function(err, msg) {
  if(err){
    emitter.emit("error",err);
  }else{
    emitter.emit("status",msg);
  }
  });
});

var controls = new Object();

controls.play = function(){
  client.sendCommand("play");
}
controls.pause = function(){
  client.sendCommant("stop");
}
controls.happyPressed = function(){
  var song = "song name here";
  console.log("We are happy while "+song+" is playing.");
}
controls.skipPressed = function(){
  client.sendCommand("next");
  console.log("Skipping");
}




controls.events = emitter;

module.export = controls;
