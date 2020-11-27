<?php $title = 'Problem Editor';
$liblist = "[ 'hammer', 'decode', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<script>

function init(){
  console.log('init...ä');
}
 
</script>

</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>for later use in MediaWiki</h2>
<!-- <div id='keyboard'></div> -->
<p id="output">output</p>
<hr>
<!-- <p id="mode_select">
  <input type="radio" id="auto" name="select_mode" checked /> 
  <label for="auto"><span></span>Automatic (left side of equation will be compared to right side)</label> 
  <br/>
  <input type="radio" id="manu" name="select_mode" />
  <label for="manu"><span></span>Manual (input will be compared with given solution)</label>
</p>
<p>
  <label for="faname">Id of Formula Applet (4 to 20 characters)</label>
  <input type="text" id="fa_name" name="bla_name" required minlength="4" maxlength="20" size="10">
</p>
<p><button type="button" id='erase-input'>Set input field</button></p> -->
<p class="formula_applet" id="editor"><span id="math-field">17 + 4 = \class{inputfield}{21}</span></p>
<hr />
<!-- <div><p id='output-code-0'>Code 0</p></div>
<div><p id='output-code-1'>Code 1</p></div>
<div><p id='output-code-2'>Code 2</p></div>
<div><p id='output-code-3'>Code 3</p></div>
<hr> -->

<?php include_once 'uses.php';?>

<?php include_once 'footer.php';?>