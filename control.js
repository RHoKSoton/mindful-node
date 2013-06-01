var mpd = require('mpd'),
    cmd = mpd.cmd
var client = mpd.connect({
  port: 6600,
  host: 'localhost',
});
//command=show(prompt("Tell mpd what?","next"));
command="next";
client.on('ready', function() {
  console.log("ready");
client.sendCommand(command,function(){
  console.log("Sent command: "+command);
});
});
client.on('system', function(name) {
  console.log("update", name);
});
client.on('system-player', function() {
  client.sendCommand(cmd("status", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
});
