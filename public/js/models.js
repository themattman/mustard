$(function() {

	window.Note = Backbone.Model.extend({
		defaults: {
			type: "",
			text: ""
		}
	});


	window.NoteList = Backbone.Collection.extend({
		model: Note
	});

});