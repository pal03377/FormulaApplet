<!-- load virtualKeyboard after hammer -->
<?php $title = 'Test Page - hammer/virtualKeyboard';
$liblist = "'hammer virtualKeyboard virtualKeyboardcss gf09css translate'";
$prefix="../"; 
include_once( $prefix . 'header.php' );
?>

<body>
<h1><?php echo $title; ?></h1>

<script>

function waitfor_virtualKeyboard(virtualKeyboard_ready) {
	// console.log( typeof MathQuill );
	if ((typeof virtualKeyboardLoaded) === "undefined") {
		console.log('waiting for virtualKeyboard...');
		setTimeout(function () {
			waitfor_virtualKeyboard(virtualKeyboard_ready)
		}, 50);
	} else {
		console.log('virtualKeyboard ready......');
		virtualKeyboard_ready();
	}
}

function waitfor_hammer(hammer_ready) {
	if ((typeof Hammer) === "undefined") {
		console.log('waiting for Hammer...');
		setTimeout(function () {
			waitfor_hammer(hammer_ready)
		}, 50);
	} else {
		console.log('Hammer ready......');
		hammer_ready();
	}
}

// first hammer, then virtualKeyboard, then init
waitfor_hammer( wfvi() );

function wfvi(){
	console.log('wfvi');
	waitfor_virtualKeyboard( init );
}

function init(){
	// get_virtualKeyboard() is defined in virtualKeyboard.js
	initTranslation();
    $('#keyboard').html(get_virtualKeyboard());
	virtualKeyboard_bind_events();
	keyboardActivate('mixed');
}

function keyboardEvent(cmd){
     $('#output').html(cmd);
}

</script>

<hr />
<div id='output'><p>output</p></div>
<div id='keyboard'></div>

<?php include_once ($prefix . 'uses.php');?>
<?php include_once ($prefix . 'footer.php');?>