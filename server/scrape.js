var router = require('./router.js');

exports.scrapeURL = function(url, $, cb){
  console.log('URL'.yellow, url);
  if(url.indexOf('google.com') != -1){
    console.log('google');
    var blob = {};
    blob.body = {};
    blob.body.url = "";

    // Extract first result
    var found = false;
    $('cite').each(function(a) {
      if(found){return;}
      for(var i = 0; i < a.children.length; i++){
        console.log(a.children[i]);
        if(i == 0){
          if(a.children[i].data.indexOf('wikipedia.org') == -1){
            break;
          }else{
            found = true;
          }
          blob.body.url = a.children[i].data;
        }else if(a.children[i].type == 'tag'){
          blob.body.url += a.children[i].children[0].data;
        }else if(a.children[i].type == 'text'){ //underscore character or something
          blob.body.url += a.children[i].data;
        }
      }
    });

    if(!found){
      $('cite').first(function(a) {
        for(var i = 0; i < a.children.length; i++){
          console.log(a.children[i]);
          if(i == 0){
            blob.body.url = a.children[i].data;
          }else if(a.children[i].type == 'tag'){
            blob.body.url += a.children[i].children[0].data;
          }else if(a.children[i].type == 'text'){ //underscore character or something
            blob.body.url += a.children[i].data;
          }
        }
      });
    }


    if(blob.body.url.indexOf('http') == -1){
      blob.body.url = 'http://' + blob.body.url;
    }
    console.log('SCRAPED URL FROM GOOGS'.magenta);
    console.log(blob.body.url);

    blob.redirect = "redirect";
    router.grab(blob, cb);
    //return; //avoid continuing in this function, jump execution to the wiki scrape
  }else{
    var imgs = [];
    if(typeof($('img')) == 'object' && $('img').length){
      $('img').each(function(a) {
        console.log(a);
        if((!a.attribs.height || a.attribs.height > 15) && a.attribs.src && a.attribs.src.indexOf('.gif') == -1){
          var pic = {};
          pic.src = a.attribs.src;
          pic.pixels = a.attribs.height * a.attribs.width;
          imgs.push(pic);
        }
      });
    }

    var scraped = {};
    console.log('img_len', imgs.length);
    if(imgs.length > 0){
      imgs.sort(function(a,b) {return (a.pixels > b.pixels) ? 1 : ((b.pixels > a.pixels) ? -1 : 0);} );
      imgs.reverse();
      delete imgs[0].pixels;
      scraped.img_src = imgs[0].src;

      // Sanitize relative links
      if(scraped.img_src[0] == '/' && scraped.img_src[1] == '/'){
        scraped.img_src = 'http:' + scraped.img_src;
      }
    }

    // Get the first line from a wiki page
    if(url.indexOf('wikipedia.org') != -1){
      var summary = $('#mw-content-text p');
      if(summary){
        summary = summary[0];
        for(var i in summary){
          if(typeof(summary[i]) == 'object'){
            console.log('YEAH'.cyan);
            var sentence = summary[i];
            var summary_sentence = [];
            for(var j in sentence){
              if(sentence[j].type == 'tag'){
                summary_sentence.push(sentence[j].children[0].raw);
              }else{
                summary_sentence.push(sentence[j].raw);
              }
            }
            summary_sentence = summary_sentence.join('');
            console.log(summary_sentence);
            console.log(scraped);
            scraped.summary = summary_sentence;
            break;
          }
        }
      }
    }
    cb(scraped);
  }
}


exports.run_regex = function (plaintext){
  console.log('plaintext'.green, plaintext);
  var link_pattern = /(.com|.org|.edu|.net|http:\/\/|https:\/\/)/i;
  if(plaintext.match(link_pattern)){
    console.log('THIS IS A LINK!!'.zebra);

    //Extract link
    var exp = /(\b(HTTPS?|https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    console.log(plaintext.match(exp));
    console.log('EAT IT D00D');
    if(plaintext.match(exp)){
      var extracted_url = plaintext.match(exp)[0];
      console.log('REGEX MATCH'.red);
      console.log(extracted_url);
      return {"engine": "wiki", "url": extracted_url};
    }
    return {"engine": "none"};
  } else if(plaintext.indexOf('#') == 0){
    console.log('THIS IS A HASH SEARCH!!'.zebra);
    console.log(plaintext.substr(1));
    return {"engine": "google", "query": plaintext.substr(1)};
  } else {
    return {"engine": "none"};
  }

}