console.log('overlay code has loaded');
// On document ready, run the initialisation of pdf overlay code
$(function() {
	// Add an overlay Div
	var overlayDiv = jQuery('<div id="overlayDiv"> </div>');
	overlayDiv.appendTo($("#pdfOuter"));
	// Set some CSS deliberately
	$("#overlayDiv").css({
		position: "absolute",
		width: "100%",
		height: "100%",
		left: 0,
		top: 0,
		zIndex: 100,  // to be on the safe side
		background: '#EEEEEE',
		background: 'rgba(220, 220, 220, 0.1)'
	});
	$("#overlayDiv").click(handleUserClickOnOverlay);
});


function handleUserClickOnOverlay(event){
	console.log('Noticed a user clicked on overlay at ' 
		+  " clientX: " + event.clientX 
		+  " clientY: " + event.clientY);
	// Find the percentage positioning within the overlay div, rather than the absolute pixels
	var clientPercentX = (event.clientX - $("#overlayDiv").offset().left) / $("#overlayDiv").width() * 100.0;
	var clientPercentY = (event.clientY - $("#overlayDiv").offset().top) / $("#overlayDiv").height() * 100.0;
	console.log('Noticed a user clicked on overlay at ' 
		+  " clientPercentX: " + clientPercentX 
		+  " clientPercentY: " + clientPercentY);
	
}