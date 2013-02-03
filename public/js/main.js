$(function(){
  
  var app = new MainView({model: new NoteList});

  $('.fb_pic').click(function(a){
    $.post('/scrape', {url: 'http://www.cnn.com'}, function(response){
      console.log('response');
      console.log(response);
      var img = document.createElement('img');
      img.src = response[0].src;
      document.getElementById('here').appendChild(img);
    });
  });

});