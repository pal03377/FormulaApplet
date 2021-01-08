<!-- load vkbd after hammer -->
<?php $title = 'Test Page - hammer (gf09)';
$liblist = "['hammer', 'vkbd', 'vkbdcss', 'gf09css']";
include_once 'header.php';
?>

<body>
<h1><?php echo $title; ?></h1>

<script>

function waitfor_vkbd(vkbd_ready) {
	// console.log( typeof MathQuill );
	if ((typeof vkbdLoaded) === "undefined") {
		console.log('waiting for VKBD...');
		setTimeout(function () {
			waitfor_vkbd(vkbd_ready)
		}, 50);
	} else {
		console.log('VKBD ready......');
		vkbd_ready();
	}
}

// first hammer, then vkbd, then init
waitfor_hammer( wfvi() );

function wfvi(){
	console.log('wfvi');
	waitfor_vkbd( init );
}

function init(){
    // get_vkbd() is defined in vkbd.js
    $('#keyboard').html(get_vkbd());
	vkbd_bind_events();
	keyboardActivate('mixed');
}

function keyboardEvent(cmd){
     $('#output').html(cmd);
}

</script>

<hr />
<div id='output'><p>output</p></div>
<div id='keyboard'></div>

<?php include_once 'footer.php';?>