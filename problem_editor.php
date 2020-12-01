<?php $title = 'Problem Editor';
$liblist = "[ 'hammer', 'decode', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'translate', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<script>
function init(){
  console.log('init...(empty)');
}
</script>
<style>
  body {
    font-family: "OpenSans Regular", sans-serif;
    margin-left: 4em;
    margin-right: 2em;
  }
</style>
</head>

<body>
<h1><?php echo $title; ?></h1>
<h2>for later use in MediaWiki</h2>
<!-- <div id='keyboard'></div> -->
<!-- <p id="output">output</p> -->
<hr>
<p class="formula_applet" id="editor"><span id="math-field">17 + 4 = \class{inputfield}{21}</span></p>
<hr />
<?php include_once 'uses.php';?>

<?php include_once 'footer.php';?>