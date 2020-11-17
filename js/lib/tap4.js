$(document).ready(function() {
	console.log('tap4.js:  document ready');
});

/**
use: make_clickable( selector ), for example make_clickable( 'span' );
gro gf08 14.09.2016
**/

var tapholdinterval = 500; //milliseconds
var tapholdId = '';

var doubletapinterval = 1000; //milliseconds
var doubletapId = '';
var listen2doubletap = false;

function handleEvent(id, type){
	console.log( id + ': ' + type );
	// window.bridgeFireFaEvent(id, type);
}

var lastId = '';
var lastType = ''
function suppressEcho(id, type){
	// suppress ECHO (tap after tap2, tap after taphold)
	if (id == lastId){
		suppress = false;
		if (lastType == 'tap2' && type == 'tap'){
//			console.log( 'suppress ' + id + '~' + type );
			suppress = true;
		}
		if (lastType == 'taphold' && type == 'tap'){
//			console.log( 'suppress ' + id + '~' + type );
			suppress = true;
		}
		if (! suppress){
			handleEvent( id, type );
		}
	} else {
		handleEvent( id, type );
	}
	lastId = id;
	lastType = type;
}

function tapholdEvent(){
	suppressEcho(tapholdId, 'taphold');
}

function doubletapEvent(){
	suppressEcho(doubletapId, 'tap2');
}

var tapholdTimerId = setTimeout( tapholdEvent, tapholdinterval);
clearTimeout( tapholdTimerId );

var doubletapTimerId = setTimeout( doubletapEvent, doubletapinterval);
clearTimeout( doubletapTimerId );

/* bind universal handler to different events */
function make_element_clickable( elem, handler) {
	var id = elem.attr("id");
	if (! elem.hasClass('clickable')) {
		elem.off();
		// elem.on("click", handler);
		elem.on("mouseup", handler);
		elem.on("mousedown", handler);
		elem.on("tap", handler);
		elem.on("mouseleave", handler);
		elem.on("blur", handler);
		elem.addClass('clickable');
	}
}

function make_clickable(){
	$( '.boundary span' ).each(function() {
		var id = $(this).attr("id");
		var elem = $('#' + id);
		make_element_clickable( elem, multiHandler );
	});
	$( 'body' ).attr( 'id', 'bodysection' );
	var elem = $( '#bodysection' );
    make_element_clickable( elem, bodyclickHandler);
}

function multiHandler(event) {
//	console.log( 'multi' );
//	console.log(event);
	if (event.type == 'mouseup'){
		suppressEcho(event.target.id, 'tap');
	}
	if (event.type == 'mousedown'){
		// handle taphold
		tapholdTimerId = setTimeout( tapholdEvent, tapholdinterval);
		tapholdId = event.target.id;
//		console.log( 'tapholdTimer.reset Id=' + tapholdId);
		// handle doubletap
		id = event.target.id;
		if ( listen2doubletap ){
			if ( id == doubletapId){
				doubletapEvent();
				clearTimeout( tapholdTimerId );
				listen2doubletap = false;
			} else {
				startListening( id );
			}
		} else {
			startListening( id );
		}
	} else {
//		console.log( 'tapholdTimer.stop' );
		clearTimeout( tapholdTimerId );
	}
}

function startListening( id ){
	doubletapTimerId = setTimeout( stopListening, doubletapinterval);
	doubletapId = id;
	listen2doubletap = true;
//	console.log( 'doubletapTimer.reset Id=' + doubletapId);
}

function stopListening(){
	listen2doubletap=false;
}

function bodyclickHandler(event) {
	if (event.target.id == 'bodysection' ){
		console.log( 'bodysection ' + event.type);
		if (event.type == 'mouseup' ){
			try{
				window.vkbd_off();
			} catch(e) {
				console.log( e );
			}
		}
	}
//	console.log(event);
}