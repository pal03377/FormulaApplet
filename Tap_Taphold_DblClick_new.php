<?php $title = 'My own doubletap';
$liblist = "[ 'tap4' ]";
include_once 'header.php';
?>

<script>
function handleEvent( id, type ){
	message = id + ' event=' + type;
	console.log(message);
	$( '#output4' ).html( $( '#output3' ).text() );
	$( '#output3' ).html( $( '#output2' ).text() );
	$( '#output2' ).html( $( '#output1' ).text() );
	$( '#output1' ).html( message );
	$( '#heading' ).html( message );
	$( '#heading' ).removeClass().addClass( type );
	$('.clickable').removeClass('tap taphold tap2 mouseleave');
	if( type != 'mouseleave' ){
		$( '#' + id ).addClass( type );
		$( '#' + id ).focus();
		$( '#' + id ).off( "focus");
	}
}

function init(){
	make_element_clickable( $( '#testbutton1' ), multiHandler );
	make_element_clickable( $( '#testbutton2' ), multiHandler );
	make_element_clickable( $( '#a' ), multiHandler );
	make_element_clickable( $( '#b' ), multiHandler );
	make_element_clickable( $( '#c' ), multiHandler );
	make_element_clickable( $( '#d' ), multiHandler );
	console.log('document ready');
};
</script>

<style>
	h1#heading {
		font-size: 2em;
	}
	#heading.click {
		background-color:darkorange;
	}
	#heading.tap {
		background-color:darkorange;
	}
	#heading.taphold {
		background-color:lime;
	}
	#heading.tap2 {
		background-color:lightblue;
	}
	#testbutton1, #testbutton2 {
		padding: 30px;
	}
	hr {
		margin-bottom: 30px;
	}
	span {
		padding: 10px;
		margin: 5px;
		border: 1px dotted blue;
		font-family: Verdana;
	}
	span.tap{
		background-color: darkorange;
		opacity: 0.6;
	}
	span.taphold{
		background-color: lime;
		opacity: 0.6;
	}
	span.tap2{
		background-color: lightblue;
		opacity: 0.6;
	}
	</style>
</head>

  <!-- body onclick='bodyclickhandler(event);' id="bodysection">  -->
  <body>
    <noscript>
      <div style="width: 22em; position: absolute; left: 50%; margin-left: -11em; color: red; background-color: white; border: 1px solid red; padding: 4px; font-family: sans-serif">
        Bitte JavaScript aktivieren.
      </div>
    </noscript>
    <h1 id="heading">tap taphold tap2 event test!</h1>
	<p>uses jQuery and tap4.js, no GWT/Java</p>
	<p id="output4">Output4</p>
	<p id="output3">Output3</p>
	<p id="output2">Output2</p>
	<p id="output1">Output1</p>
	<input type="reset" id="testbutton1" value="Button 1">
	<input type="reset" id="testbutton2" value="Button 2">
	<hr>
	<span id="a">Apfel</span><span id="b">Birne</span><span id="c">Citrone</span><span id="d">Dattel</span>
	
	<?php include_once 'footer.php';?>