window.docId = window.location.pathname;
docId = docId.replace(/\//g,"#");
console.log("Editing session", docId);

if (docId == "" || docId == "#") window.location = "/"

$(function() {

	window.NoteView = Backbone.View.extend({
		events: {
			"change":"edit",
			"dblclick": "transform",
			"click .delete": "delete",
			"mouseenter":"showEdit",
			"mouseleave":"hideEdit"
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
		transform: function() {
			// change for pre tags ***
			if(!window.fb || this.model.get('type') != "note") return;
			if(!$(".note", this.el).is("input")) {
				$(".note", this.el).replaceWith('<input class="note" value="'+$(".note", this.el).html()+'", autofocus="true", autocomplete="off">')
				$(".note", this.el).parent().addClass("highlite")
			} else {
				$(".note", this.el).replaceWith('<div class="note">'+$(".note", this.el).val()+'</div>')
				$(".note", this.el).parent().removeClass("highlite")
			}
		},
		edit: function(e) {
			var newValue = $(".note", this.el).val();
			this.model.set("text", newValue);
			this.model.set("name", fb.name);
			this.model.set("user", fb.user);
			var pos = this.model.collection.indexOf(this.model);
			window.notes.at(pos).remove();
			window.notes.insert(pos, this.model.attributes);
			var data = window.notes.get();
			console.log(data)
		},
		delete: function() {
			var pos = this.model.collection.indexOf(this.model);
			this.model.destroy();
			window.notes.at(pos).remove();
		},
		showEdit: function() {
			$(".hide", this.el).show()
		},
		hideEdit: function() {
			$(".hide", this.el).hide()
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
					$("#notes-list").empty();
					for(var i in notes) {
						that.addNote(notes[i]);
					}
				}

			    var notes = doc.at('notes');
			    window.notes = notes;

			    notes.on('insert', function (pos, note) {
			      // move to render
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

			window.ondragover = function(e) {e.preventDefault()}
		    window.ondrop = function(e) {e.preventDefault();}

		    document.getElementById('text').ondragover = function(e) {e.preventDefault()}
		    document.getElementById('text').ondrop = function(e) {e.preventDefault(); that.photoUpload(e.dataTransfer.files[0]); }
		  
		},
		submit: function(e) {
			e.preventDefault();
			var note = {
				type: "note",
				text: $("#text").val()
			}
			note.user = fb.user;
			note.name = fb.name;
			
			var that = this;
			$.post('/scrape', {url: $('#text').val()}, function(response){
				if(response != "undefined") {
		      		console.log(response)
		      		note.title = response.title;
		      		note.link = response.img_src;
		      		note.url = response.url;
		      		if(response.summary != undefined) {

		      			note.type = "search";
		      			note.text = response.summary;
		      		} else {
		      			note.type = "link";
		      			note.text = "";
		      		}
		      		console.log(note)
		      	}
				window.notes.push(note);
		      	that.addNote(note);
		    });

			$("#text").val("")
		},
		removeNote: function(pos) {
			this.model.models[pos].destroy();
		},
		addNote: function(note) {
			note = escapeText(note);

			var newNote = new Note(note);
			new NoteView({model: newNote});
      		this.model.add(newNote); // move to model??? ***

		},
		render: function() {
			$("#notes-list").empty();
	        for (var i = 0; i < this.model.models.length; i++) {
	            var view = new NoteView({model: this.model.models[i]});
	            $("#notes-list").append( view.render().el );
	        }
	        $("#notes-list").scrollTop(this.model.length * 200);
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
		photoUpload: function(file) {
			// thanks to: @paulrouget <paul@mozilla.com>

	        if (!file || !file.type.match(/image.*/)) return;
	        console.log(file)
	        var that = this;
	        var fd = new FormData(); 
	        fd.append("image", file); 
	        fd.append("key", "c242fba15f62ccb0e634c5d5dda55529");
	        var xhr = new XMLHttpRequest();
	        xhr.open("POST", "http://api.imgur.com/2/upload.json");
	        xhr.onload = function() {
	            var link = JSON.parse(xhr.responseText).upload.links.imgur_page;
	            console.log(link);
	            var note = {
					type: "pic",
					title: $("#text").val(),
					link: link+".jpeg",
					url: link
				}
				note.user = fb.user;
				note.name = fb.name;
				note.pos = window.notes.getLength();
				that.addNote(note);
				window.notes.push(note);

				$("#text").val("")
	        }

	        xhr.send(fd);
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


function escapeText(obj) {

	for (var key in obj) {
		if(typeof obj[key] == "string") {
			obj[key] = obj[key].replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
		}
		if(key == "text")
			obj.text = obj.text.replace("`","<pre>").replace("`","</pre>")
	}
	return obj;
}