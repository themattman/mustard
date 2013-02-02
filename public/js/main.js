var socket = io.connect('/');
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

$(function(){
  var docName = window.location.pathname;
  docName = docName.replace(/\//g,"#");
  console.log("Editing session", docName);
  if (docName == "" || docName == "#"){window.location = "/";}
  $('#input_box').focus(function(event){
     $('#input_box').keypress(function(k){
      if(k.keyCode == 13){
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