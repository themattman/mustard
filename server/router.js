var email   = require('./email.js')
  , fs      = require('fs')
  , sha1    = require('sha1')
  , io      = require('./app.js');

var rooms = {};

// main page
exports.splash = function(req, res){
  res.render('splash');
};

exports.room = function(req, res) {
	console.log(req.params.id);
  io.io.sockets.on('connection', function(socket){
    socket.join(req.params.id);
    console.log(socket);
    console.log('/room/' + req.params.id);

    socket.emit('getData', rooms[req.params.id]);
    console.log('SOCKET CONNECTED'.green);
    if(!rooms[req.params.id]){
      rooms[req.params.id] = [];
    }

    socket.on('enter_text', function(change){
      rooms[req.params.id].push(change);
      console.log(rooms);
      socket.broadcast.to(req.params.id).emit('update', change);
    });

    socket.on('disconnect', function(a){
      console.log('left'.red);
      socket.leave(req.params.id);
    });
    console.log(rooms);
  });
	res.render('room');
}
 
exports.email = function(req, res){
  email.send(req.body, 'template.jade', function(data) {
    res.send(data);
  });
};