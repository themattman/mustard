
$(function(){

  var doc = window.location.pathname;
  doc = doc.replace(/\//g,"#");

  console.log("Editing session", doc);

  if (doc == "" || doc == "#") window.location = "/"
  var template = _.template($("#note-temp").html());
  console.log($("#note-temp").html())
  var connection = sharejs.open(doc, 'json', function(error, doc) {
    if (error) {
      if (console) {
        console.error(error);
      }
      return;
    }

    if (doc.created) {
      doc.set({"notes":[]});
    } else {
      var notes = doc.at('notes').get();
      console.log(notes)
      for(var i in notes) {
        $("#notes-list").append(template(notes[i]))
      }
    }

    var notes = doc.at('notes')
    notes.on('insert', function (pos, item) {
      $("#notes-list").append(template(item))
      console.log(item);
    });

    $('#noteform').submit(function(e){
      e.preventDefault();
      var obj = {
          text:$("#text").val()
      }
      notes.push(obj);
      $("#notes-list").append(template(obj))
      $("#text").val("")
    });

    // ???
   /* notes.on('child op', function (path, op) {
      var item_idx = path[0]
      console.log("Item "+item_idx+" now reads "+notes.get()[item_idx])
      if (op.si != undefined) {
        // ...
      } else if (op.sd != undefined) {
        // ...
      }
    })*/
    
  });


  // email
  $('#addFriend').click(function() {
    var email = prompt('Add your friend!');
    $.post('/email', {email: email, name: 'your friend', doc: sessionHash}, function(data) {
      console.log('added friend');
    }); 
  });

  // status monitoring
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

});