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

var url_to_return = "";
exports.grab = function(req, res){
  try{
    var scraper = new nodeio.Job({
      input: false,
      run: function (scraper, url) {
        console.log('url'.green, url);
        url_to_return = url;
        this.getHtml(url, function(err, $) {
          if (err) {
            console.log(err);
            res.send('undefined');
          } else {
            scrape.scrapeURL(url, $, function(response){
              if(typeof(req.redirect) != 'undefined'){
                res(response);
              }else{
                response.url = url_to_return;
                res.json(response);
              }
            });
          }
        });
      }
    });

    // Figure out where to scrape
    var todo = scrape.run_regex(req.body.url);
    console.log('DECISION'.cyan);
    console.log(todo);
    if(todo.engine == "google"){
      scraper.run(scraper, "https://www.google.com/search?q="+todo.query);
    }else if(todo.engine != "none"){
      if(todo.url){
        scraper.run(scraper, todo.url);
      }else{
        res.send('undefined');
      }
    }else{
      res.send('undefined');
    }
  } catch(err){
    //console.log(err);
    res.send('undefined');
  }
};