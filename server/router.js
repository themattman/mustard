var email  = require('./email.js')
  , fs     = require('fs')
  , sha1   = require('sha1')
  , http   = require('http')
  , nodeio = require('node.io');

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

exports.scrape = function(req, res){
  var scrape = new nodeio.Job({
    input: false,
    run: function (url) {
      console.log('url'.green, url);
      this.getHtml(url, function(err, $) {
        if (err) {
          this.exit(err);
          console.log(err);
        } else {
          var imgs = [];
          var cntr = 0;
          $('img').each(function(a) {
              if(a.attribs.height > 50 && a.attribs.src.indexOf('.gif') == -1){
                var pic = {};
                pic.src = a.attribs.src;
                pic.pixels = a.attribs.height * a.attribs.width;
                imgs.push(pic);
                cntr++;
              }
          });
          imgs.sort(function(a,b) {return (a.pixels > b.pixels) ? 1 : ((b.pixels > a.pixels) ? -1 : 0);} );
          imgs.reverse();
          imgs.splice(3);
          for(var i in imgs){
            delete imgs[i].pixels;
            console.log(imgs[i]);
          }
          console.log('i=', cntr);
          res.json(imgs);
        }
      });
    }
  });
  scrape.run(req.body.url);

};