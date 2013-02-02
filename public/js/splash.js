$('#start').submit(function(e){

	e.preventDefault();
	var doc = '';
	if($('#doc').val()) {
		doc = $('#doc').val();

		// check if namespace is available!
		window.location = "./room/"+doc;
	} else {
		$(this).animate({marginRight:"60px"}, 60, function() {
			$(this).animate({marginRight:"0px", marginLeft:"60px"}, 60, function() {
				$(this).animate({marginLeft:"0px"}, 60);
			});
		})
	}  

});