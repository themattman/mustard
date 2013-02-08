var email  = require('./email.js')
  , fs     = require('fs')
  , sha1   = require('sha1')
  , http   = require('http')
  , nodeio = require('node.io')
  , scrape = require('./scrape')
  , wiki    = require('wikifetch')
;

// main page
exports.splash = function(req, res){
  res.render('splash');
};

exports.room = function(req, res) {
	console.log(req.params.id);
	// prevent bad things from happening here
	res.render('room', {topic: req.params.id});
}
 
exports.email = function(req, res){
  email.send(req.body, 'template.jade', function(data) {
    res.send(data);
  });
};

exports.grab = function(req, res){
  try{
    console.log(req.body);
    if(req.body.url[0] === '#'){
      var searchTerm = req.body.url.substr(1,req.body.url.length-1);
      var wikiScraper = new wiki.WikiFetch();
      wikiScraper.loadArticle(searchTerm, function(err, result){
        console.log(result);
        res.json(result);
      });
    }else{
      res.send('undefined');
    }
  }catch(e){
    console.log('error caught.', e);
    if(!res.send){console.log('can\'t response');}
    res.send('undefined');
  }
};
