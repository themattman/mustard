
$(function(){

  var docName = window.location.pathname;
  docName = docName.replace(/\//g,"#");

  console.log("Editing session", docName);

  if (docName == "" || docName == "#"){window.location = "/";}
  
  // *** Trains
  /*var connection = sharejs.open(docName, 'json', function(error, doc) {
    if (error) {
      if (console) {
        console.error(error);
      }
      return;
    }

    ///doc.attach_textarea(document.getElementById('input_box'));
    
    if (doc.created) {
      /*doc.set(["Thomas the Tank Engine",
        "Edward the Blue Engine",
        "Henry the Green Engine",
        "Gordon the Big Engine",
        "James the Red Engine",
        "Percy the Small Engine",
        "The Fat Controller"
      ]);
    }
    
    var trains = doc.get();
    console.log(doc);
    $.each(trains, function(i, train) {
      $('#trains').append($('<li>').text(trains[i])); //.attr('data-id', i)
    });

    doc.on('change', function(c){
      console.log('change');
      console.log(c);
    });

    /*doc.on('insert', function(position, text) {
      console.log('insert fired');
    });
    doc.on('remoteop', function(op) {
      console.log('remoteop fired');
    });

    $('#input_box').focus(function(event){
    console.log('event');
     $('#input_box').keypress(function(k){
      if(k.keyCode == 13){
        //console.log('TEXT ENTERED');
        //var delta_objects = [];
        //var delta = {};
        //delta.i = $('#input_box').val();
        //delta.text = $('#input_box').val();
        //delta.timestamp = new Date().getTime() / 1000; //UNIXTIME
        //delta_objects.push(delta);
        //doc.submitOp(delta);

        //console.log(doc.length );
        //console.log(doc);
        console.log($('#input_box').val());
        //console.log(doc.addAt(;1));
        doc.addAt(doc.length, $('#input_box').val(), function(a, b){
          console.log('cb');
          console.log(a);
          console.log(b);
        });
        /*doc.snapshot.push($('#input_box').val());
        //console.log(doc.type);
        console.log(doc.get());
        //doc.submitOp({i:"Hi there!\n", p:0});

        //document.getElementById('input_box').innerHTML = "";
        //$('#input_box').html('');
        //console.log($('#input_box'));
      }
    });
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
  });*/
});