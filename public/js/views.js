window.docId = window.location.pathname;
docId = docId.replace(/\//g,"#");
console.log("Editing session", docId);

if (docId == "" || docId == "#") window.location = "/"

$(function() {

	window.NoteView = Backbone.View.extend({
		el: ".note",
		events: {
			"click":"render"
		},
		initialize: function() {
			console.log(this.model.attributes);
		},
		template: _.template($("#note-temp").html()),
		render: function() {
			console.log('hello');
		}
	});

	window.MainView = Backbone.View.extend({
		el: "body",
		events: {
			"click #addFriend":"email"
		},
		template: _.template($("#note-temp").html()),
		initialize: function () {
			 
			var that = this;
			var connection = sharejs.open(docId, 'json', function(error, doc) {
				if (error) {
					console.error(error);
					return;
				}

				if (doc.created) {
					doc.set({"notes":[]});
				} else {
					var notes = doc.at('notes').get();
					for(var i in notes) {
						that.addNote(notes[i]);
						$("#notes-list").append(that.template(notes[i]))
					}
				}

			    var notes = doc.at('notes');
			    notes.on('insert', function (pos, note) {
			    	console.log(pos, note, that.model)
			      // move to render
			      that.addNote(note);
			      $("#notes-list").append(that.template(note))
			    });

				$('#noteform').submit(function(e){
					e.preventDefault();
					var note = {
						type: "note",
						text: $("#text").val()
					}
					that.addNote(note);
					notes.push(note);
					console.log(that.model)

					$("#notes-list").append(that.template(note))
					$("#text").val("")

				});
			});
			// keep tabs on connections
			that.monitor(connection)


			  

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
		},
		addNote: function(note) {
			var newNote = new Note(note);
			new NoteView({model: newNote});
      		this.model.add(newNote);
      		
		},
		render: function() {
			console.log("render")
		},
		monitor: function(connection) {
			// status monitoring
			  var status = $("#status");
			  var register = function(state, klass, text) {
			    connection.on(state, function() {
			      status.attr("class", 'label ' + 'label-'+klass); 
			      status.html(text);
			    });
			  };
			  register('ok', 'success', 'Online');
			  register('connecting', 'warning', 'Connecting...');
			  register('disconnected', 'important', 'Offline');
			  register('stopped', 'important', 'Error');
		},
		email: function() {
			// email
		    var email = prompt('Add your friend!');
		    $.post('/email', {email: email, name: 'your friend', doc: docId}, function(data) {
		      console.log('added friend');
		    }); 
		}
	});



});