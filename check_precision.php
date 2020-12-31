<?php $title = 'Check precision';
$liblist = "[ 'hammer', 'decode', 'translate', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<body>
<h1><?php echo $title; ?></h1>
<h2>See console!</h2>
<p class="formula_applet" id="check_01">(2u + 7v)^2 = {{result}}</p> default precision<br />
<p class="formula_applet" id="check_02" precision="0.001">(2u + 7v)^2 = {{result}}</p> precision="0.001"<br />
<p class="formula_applet" id="check_03" prec="0.001">(2u + 7v)^2 = {{result}}</p> prec="0.001"<br />
<p class="formula_applet" id="check_04" precision="0.1%">(2u + 7v)^2 = {{result}}</p> precision="0.1%"<br />
<p class="formula_applet" prec="0.25%" id="check_05">(2u + 7v)^2 = {{result}}</p> prec="0.25%"<br />
<p class="formula_applet" id="check_06" precision="0,001">(2u + 7v)^2 = {{result}}</p> precision="0,001" (Comma)<br />
<p class="formula_applet" id="check_07" prec="0.1 %">(2u + 7v)^2 = {{result}}</p> prec="0.1 %" (space)<br />
<p class="formula_applet" id="check_08" prec="4.7e-6">(2u + 7v)^2 = {{result}}</p> prec="4.7e-6"<br />

<?php include_once 'footer.php';?>