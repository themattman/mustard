
var express   = require('express')
  , app       = express()
  , colors    = require('colors')
  , router    = require('./router.js')
  , config    = require('./config.js')
  , http      = require('http')
  //, share 	  = require('share').server
  , io        = require('socket.io');

// setup here
config(app);
//share.attach(app, {db: {type: 'none'}});

// start the server
var httpApp = http.createServer(app).listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')).yellow);
});

// define API routes here
app.get('/',          router.splash);
app.get('/room/:id', 	router.room);

app.post('/email',  router.email );

var documents = [];

var io = require('socket.io').listen(httpApp).set('log level', 1);

io.sockets.on('connection', function(socket){
  console.log('SOCKET CONNECTED'.green);
});
