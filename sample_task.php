<?php $title = 'Sample Task';
$liblist = "[ 'hammer', 'zip', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<script>

// function waitfor_vkbd(vkbd_ready) {
// 	// console.log( typeof MathQuill );
// 	if ((typeof vkbdLoaded) === "undefined") {
// 		console.log('waiting for VKBD...');
// 		setTimeout(function () {
// 			waitfor_vkbd(vkbd_ready)
// 		}, 50);
// 	} else {
// 		console.log('**** VKBD ready......');
// 		vkbd_ready;
// 	}
// }

// // first hammer, then vkbd, then init
// console.log('Bli');
// waitfor_hammer( wf_vkbd() );
// console.log('Bla');

// function wf_vkbd(){
// 	console.log('wf_vkbd');
// 	waitfor_vkbd( wf_mq() );
// }

// function wf_mq(){
// 	console.log('wf_mq');
// 	waitfor_mathquill_and_if_ready_then_do( init() );
// }

function init(){
  console.log('init...');
  vkbd_init();
}

function keyboardEvent(cmd){
	bridge(cmd);
  $('#output').html(cmd);
}

</script>

</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>for later use in MediaWiki</h2>
<!-- <div id='keyboard'></div> -->
<p id="output">output</p>
<!-- <p class="formula_applet" id="light-house-0">(r + h)^2 = r^2 + s^2 \Rightarrow</p><br /> -->
<p class="formula_applet" id="light-house" data-zip='UEsDBAoAAAAAAGeNOFFTGYHLAwAAAAMAAAALAAAAY29udGVudC50eHQyaHJQSwECFAAKAAAAAABnjThRUxmBywMAAAADAAAACwAAAAAAAAAAAAAAAAAAAAAAY29udGVudC50eHRQSwUGAAAAAAEAAQA5AAAALAAAAAAA'>s=\sqrt{ h^2 + \MathQuillMathField{} }</p><br />
<p class="formula_applet" id="binom_01">(2u + 7v)^2 = \MathQuillMathField{}</p><br />
<p class="formula_applet" id="binom_02" data-zip='UEsDBAoAAAAAABpEO1HIazOjBQAAAAUAAAALAAAAY29udGVudC50eHQ0OXZeMlBLAQIUAAoAAAAAABpEO1HIazOjBQAAAAUAAAALAAAAAAAAAAAAAAAAAAAAAABjb250ZW50LnR4dFBLBQYAAAAAAQABADkAAAAuAAAAAAA='>(2u + 7v)^2 = 4u^2 + 28uv + \MathQuillMathField{}</p><br />
<p class="formula_applet" id="fraction">\frac{13t^2 - 5t}{t} = \MathQuillMathField{}</p><br />
<hr>
<?php include_once 'uses.php';?>

<?php include_once 'footer.php';?>