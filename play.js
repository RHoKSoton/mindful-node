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

// Is the same song playing?
var same = 0;

var controls = new Object();

controls.play = function(){
  client.sendCommand("play");
};

controls.pause = function(){
  client.sendCommand(cmd("pause", [1]));
};

controls.stop = function(){
  client.sendCommand("stop");
};

controls.toggle = function(){
  client.sendCommand("pause");
};

controls.happyPressed = function(){
  if(same) return;
  var song = "N";
  client.sendCommand(cmd("currentsong",[]),function(err,msg){
    if(err) throw err;
    song = msg.match(/\nTitle: (.*?)\n/i)[1];
    console.log("We are happy while "+song+" is playing.");
    emitter.emit("happy",song);
    same = 1;
  });
};

controls.skipPressed = function(){
  client.sendCommand("next");
  console.log("Skipping");
};




controls.events = emitter;

module.exports = controls;
