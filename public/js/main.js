
$(function(){

  var doc = window.location.pathname;
  doc = doc.replace(/\//g,"#");

  console.log("Editing session", doc);

  if (doc == "" || doc == "#") window.location = "/"
  
  // *** Trains
  var connection = sharejs.open(doc, 'json', function(error, doc) {
    if (error) {
      if (console) {
        console.error(error);
      }
      return;
    }
    
    if (doc.created) {
      doc.set(["Thomas the Tank Engine",
        "Edward the Blue Engine",
        "Henry the Green Engine",
        "Gordon the Big Engine",
        "James the Red Engine",
        "Percy the Small Engine",
        "The Fat Controller"
      ]);
    }
    
    var trains = doc.get();
    $.each(trains, function(i, train) {
      $('#trains').append($('<li>').text(trains[i])); //.attr('data-id', i)
    });

    
    
  });

  var status = document.getElementById('status');
  var register = function(state, klass, text) {
    connection.on(state, function() {
      status.className = 'label ' + 'label-'+klass;
      status.innerHTML = text;
    });
  };

  register('ok', 'success', 'Online');
  register('connecting', 'warning', 'Connecting...');
  register('disconnected', 'important', 'Offline');
  register('stopped', 'important', 'Error');



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