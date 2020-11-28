<?php $title = 'Sample Tasks';
$liblist = "[ 'hammer', 'decode', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<script>
function init(){
  console.log('init... (empty)');
}
</script>

</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>for later use in MediaWiki</h2>
<!-- <div id='keyboard'></div> -->
<p id="output">output</p>
<p class="formula_applet" id="light-house" data-b64='gOmkT'>s=\sqrt{ h^2 + \MathQuillMathField{} }</p><br />
<p class="formula_applet" id="binom_01">(2u + 7v)^2 = \MathQuillMathField{}</p><br />
<p class="formula_applet" id="binom_02">(2u + 7v)^2 = 4u^2 + 28uv + \MathQuillMathField{}</p><br />
<p class="formula_applet" id="fraction">\frac{13t^2 - 5t}{t} = \MathQuillMathField{}</p><br />
<p class="formula_applet" id="BliBlaBlu" data-b64="N2gMy">17x+4x=\MathQuillMathField{}</p>
<hr>

<?php include_once 'uses.php';?>

<?php include_once 'footer.php';?>