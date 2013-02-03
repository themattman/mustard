var email  = require('./email.js')
  , fs     = require('fs')
  , sha1   = require('sha1')
  , http   = require('http')
  , nodeio = require('node.io')
  , scrape = require('./scrape');

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
  var scraper = new nodeio.Job({
    input: false,
    run: function (scraper, url) {
      console.log('url'.green, url);
      this.getHtml(url, function(err, $) {
        if (err) {
          console.log(err);
          this.exit(err);
        } else {
          scrape.scrapeURL(url, $, function(response){
            if(typeof(req.redirect) != 'undefined'){
              res(response);
            }else{
              res.json(response);
            }
          });
        }
      });
    }
  });

  // Figure out where to scrape
  var todo = scrape.run_regex(req.body.url);
  console.log(todo);
  if(todo.engine == "google"){
    scraper.run(scraper, "https://www.google.com/search?q="+todo.query);
  }else if(todo.engine != "none"){
    scraper.run(scraper, req.body.url);
  }else{
    res.send('Hi :)');
  }
};