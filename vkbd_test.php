<?php $title = 'Test Page - VKBD (gf09)';
$liblist = "['vkbd', 'vkbdcss']";
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
    // get_vkbd() is defined in vkbd.js
    $('#output').html(get_vkbd());
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

function tabClick(ev, table_id){
    // console.log(ev);
    console.log(table_id);
    $( '#vkbd table' ).css( "display", "none");
    $( '#vkbd table#' + table_id ).css( "display", "table");
    $( '.vkbd_tab button' ).removeClass( "selected");
    $( '.vkbd_tab button#button-' + table_id ).addClass( "selected");
    
}

</script>

<div id='output'></div>

<?php include_once 'footer.php';?>