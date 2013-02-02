var email   = require('./email.js')
  , fs      = require('fs')
  , sha1    = require('sha1');

// main page
exports.splash = function(req, res){
  res.render('splash');
};

exports.room = function(req, res) {
	console.log(req.params.id);
	res.render('room');
}
 
exports.email = function(req, res){
  email.send(req.body, 'template.jade', function(data) {
    res.send(data);
  });
};