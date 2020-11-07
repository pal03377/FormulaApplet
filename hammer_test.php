<?php $title = 'Test Page - hammer (gf09)';
// stop: do not wait for mathquill and do not prepare_page
$liblist = "['hammer', 'vkbd', 'vkbdcss']";
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
   $('#keyboard').html(get_vkbd());
   $(".vkbd_button").click(function (ev) {
        clickEvent(ev);
    });
    // also children and grandchildren and...
    $(".vkbd_button").find().click(function (ev) {
        clickEvent(ev);
    });
    // dragElement(document.getElementById("vkbd"));
    var vkbdElement = document.getElementById('vkbd');
    // https://hammerjs.github.io/getting-started/
    var mc = new Hammer(vkbdElement);
    // mc.on("panleft panright tap press", function(ev) {
    //     document.getElementById('output').innerHTML =
    //     ev.type +" gesture detected.";
    // });
    // var width_old = $("#vkbd").css("width");
    var scale_temp = 1;
    var scale_start = 1;
    // console.log('width_old=' + width_old);
    mc.get('pinch').set({ enable: true });
    mc.on('pinch pinchstart', function(ev) {
        console.log(ev.type + ' ' + ev.scale);
        if (ev.type == 'pinchstart') {
            // start with scale_temp of the last pinch
        scale_start = scale_temp;
        //     width_old = $("#vkbd").css("width");
        //     // remove px
        //     width_old = width_old.substr(0, width_old.length - 2);
        }
        if (ev.type == 'pinch') {
            // var width_new = width_old * ev.scale;
            // width_new = width_new + 'px';
            scale_temp = scale_start * ev.scale;
            var scalecommand = "translate(-50%, -50%) scale("+ scale_temp +")";
            console.log(scalecommand);
            $("#vkbd").css("transform", scalecommand);
        }
        // document.getElementById('output').innerHTML =
        // ev.type + ' ' + ev.scale;
        //  $("#vkbd").css("zoom", ev.scale);
    });
    // mc.get('rotate').set({ enable: true });
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

<hr />
<div id='output'><p>output</p></div>
<div id='keyboard'></div>

<?php include_once 'footer.php';?>