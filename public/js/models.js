$(function() {

	window.Note = Backbone.Model.extend({
		defaults: {
			type: "",
			text: "",
			name: "",
			user: "",
			pos: null
		}
	});


	window.NoteList = Backbone.Collection.extend({
		model: Note,
		comparator: function(note) {
		  return note.get("pos");
		}
	});

});