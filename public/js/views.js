window.docId = window.location.pathname;
docId = docId.replace(/\//g,"#");
console.log("Editing session", docId);

if (docId == "" || docId == "#") window.location = "/"

$(function() {

	window.NoteView = Backbone.View.extend({
		events: {
			"change":"edit",
			"click .fbPic":"fbLink",
			"dblclick": "transform"
		},
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "destroy", this.remove);
			this.render();
		},
		template: _.template($("#note-temp").html()),
		render: function() {
			var row = this.template(this.model.attributes);
			this.$el.html(row);
			return this;
		},
		fbLink: function() {
			window.location = "https://www.facebook.com/" + this.model.get('user');
		},
		transform: function() {
			if(!$(".note", this.el).is("input")) {
				$(".note", this.el).replaceWith('<input class="note" value="'+$(".note", this.el).html()+'", autofocus="true", autocomplete="off">')
				$(".note", this.el).parent().addClass("highlite")
			} else {
				$(".note", this.el).replaceWith('<div class="note" ">'+$(".note", this.el).val()+'</div>')
				$(".note", this.el).parent().removeClass("highlite")
			}
		},
		edit: function(e) {
			var newValue = $(".note", this.el).val();
			this.model.set("text", newValue);
			this.model.set("name", fb.name);
			this.model.set("user", fb.user);

			window.notes.at(this.model.get('pos')).remove();
			window.notes.insert(this.model.get('pos'), this.model.attributes);
			var data = window.notes.get();
			console.log(data)
		}
	});

	window.MainView = Backbone.View.extend({
		el: "body",
		events: {
			"click #addFriend":"email",
			"submit #noteform": "submit"
		},
		template: _.template($("#note-temp").html()),
		initialize: function () {

			this.listenTo(this.model, "add", this.render);
			this.listenTo(this.model, "remove", this.render);

			var that = this;
			var connection = sharejs.open(docId, 'json', function(error, doc) {
				if (error) {
					console.error(error);
					return;
				}

				if (doc.created) {
					doc.set({"notes":[]});
					$("#notes-list").empty();
				} else {
					var notes = doc.at('notes').get();
					for(var i in notes) {
						that.addNote(notes[i]);
					}
				}

			    var notes = doc.at('notes');
			    window.notes = notes;


			    notes.on('insert', function (pos, note) {
			      // move to render
			      //console.log(pos, note);
			      that.addNote(note);
			    });

			    notes.on('delete', function (pos, note) {
			      // move to render
			      //console.log(pos, note);
			      that.removeNote(pos);
			    });

			     notes.on('child op', function (path, op) {
				  var item_idx = path[0]
				  console.log("Item "+item_idx+" now reads "+todo.get()[item_idx])
				  if (op.si != undefined) {
				    // ...
				  } else if (op.sd != undefined) {
				    // ...
				  }
				})

			});
			// keep tabs on connections
			that.monitor(connection)

		    // ???
		  
		},
		submit: function(e) {
			e.preventDefault();
			var note = {
				type: "note",
				text: $("#text").val()
			}
			note.user = fb.user;
			note.name = fb.name;
			note.pos = window.notes.getLength(); // get max pos ***?
			this.addNote(note);
			window.notes.push(note);

			$("#text").val("")
		},
		removeNote: function(pos) {
			this.model.models[pos].destroy();
		},
		addNote: function(note) {
			var newNote = new Note(note);
			new NoteView({model: newNote});
      		this.model.add(newNote);
      		$("#notes-list").scrollTop(this.model.length * 66);
		},
		render: function() {
			$("#notes-list").empty();
			console.log('rendering')
	        for (var i = 0; i < this.model.models.length; i++) {
	            var view = new NoteView({model: this.model.models[i]});
	            $("#notes-list").append( view.render().el );
	        }
			return this;
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