console.log('overlay code has loaded');
var arrayHotspots = [];
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
	
	// XXX should be the unique id of the comment
	var hotspotId = 'hotspot' + arrayHotspots.length;
	arrayHotspots.push(hotspotId);
	var hotspotObj = jQuery('<div class="hotspot" id="' + hotspotId + '"> <i class="fa fa-star" aria-hidden="true"></i> </div>');
	hotspotObj.appendTo($("#pdfOuter"));
	$('#' + hotspotId).css({
		position: "absolute",
		//width: "20px",
		//height: "20px",
		left: clientPercentX + '%',
		top: clientPercentY + '%',
		zIndex: 99,  // below the overlay div
		color: 'rgba(250, 250, 0, 0.4)',
		//background: 'rgba(250, 250, 0, 0.2)',
		padding: '5px',
		'font-size': '24px',
		'border-radius': '10px'
	});
	// Draw an arrow to it
	//drawArrowOnCanvas(hotspotId, 'commentId');	// TODO: replace commentId here
}


// Draw an arrow from the comment to the hotspot
function drawArrowOnCanvas(hotspotId, commentId) {
	console.log('Drawing arrow on canvas for ' + hotspotId);
	var hotspotJq = $('#' + hotspotId);
	console.log($('#' + hotspotId));
	console.log(hotspotJq.position().top + ' and left: ' + hotspotJq.position().left);
	
	var ctx = document.getElementById('arrowCanvas').getContext('2d');
	var startPointX = 0;
	var startPointY = 0;
	var endPointX = hotspotJq.position().left; // * $("#pdfOuter").width; // Multiplying by width as left was reporting back in percentage
	var endPointY = hotspotJq.position().top;//* $("#pdfOuter").height;
	var quadPointX = 35;
	var quadPointY = 70;

	ctx.strokeStyle = "rgba(0,0,255, 0.2)";
	ctx.lineWidth = 1;

	var arrowAngle = Math.atan2(quadPointX - endPointX, quadPointY - endPointY) + Math.PI;
	var arrowWidth = 8;

	ctx.beginPath();
	ctx.moveTo(startPointX, startPointY);
	// either //ctx.lineTo(endPointX, endPointY); or
	ctx.quadraticCurveTo(quadPointX, quadPointY, endPointX, endPointY);
	
	ctx.moveTo(endPointX - (arrowWidth * Math.sin(arrowAngle - Math.PI / 6)), 
			   endPointY - (arrowWidth * Math.cos(arrowAngle - Math.PI / 6)));

	ctx.lineTo(endPointX, endPointY);

	ctx.lineTo(endPointX - (arrowWidth * Math.sin(arrowAngle + Math.PI / 6)), 
			   endPointY - (arrowWidth * Math.cos(arrowAngle + Math.PI / 6)));

	ctx.stroke();
	ctx.closePath();
}
