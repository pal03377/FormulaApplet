<?php $title = 'Test Page - VKBD (gf09)';
// stop: do not wait for mathquill and do not prepare_page
$liblist = "['vkbd', 'vkbdcss', 'stop' ]";
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

waitfor_vkbd(function(){
    console.log('Here is vkbd_test.php');
    get_vkbd();
    $(".vkbd").click(function (ev) {
        clickEvent(ev);
    });
});

function clickEvent(ev){
    console.log(ev);
    var cmd = $( ev.target).attr('cmd');
    console.log(cmd);
}

function get_vkbd(){
    var vkbd_keys_mixed = create_vkbd(keys_mixed);
    console.log(vkbd_keys_mixed);
    $('#output').html(vkbd_keys_mixed);
}

</script>

<div id='output'></div>

<?php include_once 'footer.php'; ?>