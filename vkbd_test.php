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
    $('#output').html(fetch_vkbd());
    $(".vkbd_button").click(function (ev) {
        clickEvent(ev);
    });
    // also children and grandchildren and...
    $(".vkbd_button").find().click(function (ev) {
        clickEvent(ev);
    });
    dragElement(document.getElementById("vkbd"));
});

function clickEvent(ev){
    // console.log(ev);
    var cmd = $( ev.target).attr('cmd');
    if (typeof cmd == 'undefined'){
    //    console.log('*** undefined');
    //    console.log($(ev.target).parents());
       var temp = $(ev.target).parents().filter('.vkbd_button');
       cmd = $(temp).attr('cmd');
    }
    console.log(cmd);
}

function fetch_vkbd(){
    return get_vkbd();
}

</script>

<div id='output'></div>

<?php include_once 'footer.php';?>