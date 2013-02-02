
$(function(){

  var doc = window.location.pathname;
  doc = doc.replace(/\//g,"#");

  console.log("Editing session", doc);

  if (doc == "" || doc == "#") window.location = "/"

  var elem = document.getElementById('json');
  
  var connection = sharejs.open('blag', 'text', function(error, doc) {
    if (error) {
      console.log(error);
    } else {
      elem.disabled = false;
      doc.attach_textarea(elem);
    }
  });

  /*var status = document.getElementById('status');
  var register = function(state, klass, text) {
    connection.on(state, function() {
      status.className = 'label ' + klass;
      status.innerHTML = text;
    });
  };

  register('ok', 'success', 'Online');
  register('connecting', 'warning', 'Connecting...');
  register('disconnected', 'important', 'Offline');
  register('stopped', 'important', 'Error');*/

  $('#addFriend').click(function() {
    var email = prompt('Add your friend!');
    $.post('/email', {email: email, name: 'your friend', doc: sessionHash}, function(data) {
      console.log('added friend');
    }); 
  });


  $("#syntaxSelect").change(function() {
    console.log($(this).val())
  });
});