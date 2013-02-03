
var express   = require('express')
  , app       = express()
  , colors    = require('colors')
  , router    = require('./router.js')
  , config    = require('./config.js')
  , http      = require('http')
  , share 	  = require('share').server;

// setup here
config(app);
share.attach(app, {db: {type: 'none'}});

// start the server
var httpApp = http.createServer(app).listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')).yellow);
});

// define API routes here
app.get('/',          router.splash);
app.get('/room/:id', 	router.room);


app.post('/email',  router.email );
app.post('/scrape', router.scrape);