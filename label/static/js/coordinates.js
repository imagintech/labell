

$(document).ready(function() {
    $("img").on("click", function(event) {
        $.getJSON($SCRIPT_ROOT + '/_add_numbers', {
        	a: event.pageX - this.offsetLeft,
        	b: event.pageY - this.offsetTop
      	}, function(data) {
        	$("#result").text(data.result);
      });
    });
});