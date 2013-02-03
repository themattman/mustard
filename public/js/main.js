$(function(){
  
  var app = new MainView({model: new NoteList});

  $('.fb_pic').click(function(a){
    var target = a.target.src.substr(a.target.src.indexOf('.com')+5);
    var fb_username = target.substr(0, target.indexOf('/'));
    console.log(fb_username);
    window.location = "https://www.facebook.com/" + fb_username;
  });

  $.post('/scrape', {url: 'http://www.google.com'}, function(response){
    console.log('response');
    console.log(response);
  });

});