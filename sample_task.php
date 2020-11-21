<?php $title = 'Sample Task';
$liblist = "[ 'hammer', 'zip', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<script>

function init(){
  console.log('init...');
  // vkbd_init();
}

// function keyboardEvent(cmd){
// 	bridge(cmd);
//   $('#output').html(cmd);
// }

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
<p class="formula_applet" id="BliBlaBlu" data-zip="UEsDBAoAAAAAAGqhdFFQFi1AAwAAAAMAAAALAAAAY29udGVudC50eHQyMXhQSwECFAAKAAAAAABqoXRRUBYtQAMAAAADAAAACwAAAAAAAAAAAAAAAAAAAAAAY29udGVudC50eHRQSwUGAAAAAAEAAQA5AAAALAAAAAAA">17x+4x=\MathQuillMathField{}</p>
<hr>
<p><button type="button" id='erase-input'>Erase input field</button></p>
<p class="formula_applet" id="editor"><span id="math-field">17 + 4 = \class{inputfield}{21}</span></p>
<hr />
<div><p id='output-code-0'>Code 0</p></div>
<div><p id='output-code-1'>Code 1</p></div>
<div><p id='output-code-2'>Code 2</p></div>
<div><p id='output-code-3'>Code 3</p></div>
<hr>

<?php include_once 'uses.php';?>

<?php include_once 'footer.php';?>