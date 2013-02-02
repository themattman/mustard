$(function(){
  var socket = io.connect('http://localhost:3000/room/' + window.location.pathname.substr(6));
  console.log(socket);
  console.log('/room/' + window.location.pathname.substr(6));
  socket.on('connect', function(){
    console.log('on_connect');
  });
  socket.on('update', function(change){
    console.log('update');
    console.log(change);
    var li = document.createElement('li');
    li.innerHTML = change.text;
    document.getElementById('feed').appendChild(li);
  });
  socket.on('getData', function(data){
    console.log('getData');
    for(var i in data){
      var li = document.createElement('li');
      li.innerHTML = data[i].text;
      document.getElementById('feed').appendChild(li);
    }
  });
  var docName = window.location.pathname;
  docName = docName.replace(/\//g,"#");
  console.log("Editing session", docName);
  if (docName == "" || docName == "#"){window.location = "/";}
  $('#input_box').focus(function(event){
     $('#input_box').keypress(function(k){
      if(k.keyCode == 13 && $('#input_box').val().length > 0){
        console.log($('#input_box').val());
        var update = {};
        update.text = $('#input_box').val();
        update.timestamp = new Date().toUTCString();
        console.log(update);
        socket.emit('enter_text', update);
        var li = document.createElement('li');
        li.innerHTML = update.text;
        document.getElementById('feed').appendChild(li);
        $('#input_box').val('');
      }
    });
   });
});