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
  controls.changevol();
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

function getSongId(cb){
  client.sendCommand(cmd("currentsong",[]),function(err,msg){
    id = msg.match(/\nId: (.*?)\n/i)[1];
    console.log("Song id is "+id+".");
    cb(id);
  });
}


// Is the same song playing?
var same = 0;
var currId = -1;
var vol = 100;
var controls = new Object();


controls.volumeUpPressed = function(){
  if (vol < 100) {
   vol = vol + 5;
   this.changevol();
   }
};

controls.volumeDownPressed = function(){
  if (vol > 0) {
    vol = vol - 5;
    this.changevol();
  }
};

controls.changevol = function(){
  console.log("Setting volume to: "+vol);
  client.sendCommand(cmd("setvol", [vol]));
};

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

controls.skip = function(){
  client.sendCommand("next");
  console.log("Skipping");
  same = 0;
};

controls.skipPressed = function(){
  this.skip();
};

controls.events = emitter;

module.exports = controls;


controls.events.on("status", function(msg) {
  //console.log(msg);
  same = 0;
});
