<?php $title = 'Problem Editor';  $header='<span class="tr de problemeditor">Aufgaben-Editor</span><span class="tr en problemeditor">Problem Editor</span>';
$liblist = "[ 'hammer', 'decode', 'prepare_page', 'mathquill', 'tex_parser', 'mathquillcss', 'gf09css', 'translate', 'vkbd', 'vkbdcss']";
include_once 'header.php';
?>

<script>
function init(){
  initTranslation();
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
<h1><?php echo $header; ?></h1>
<h2 class='tr de later'>Zum späteren Gebrauch in einem MediaWiki</h2>
<h2 class='tr en later'>for later use in MediaWiki</h2>
<!-- <div id='keyboard'></div> -->
<!-- <p id="output">output</p> -->
<hr>
<p class="formula_applet" id="editor"><span id="math-field">17 + 4 = \class{inputfield}{21}</span></p>
<hr />
<?php include_once 'uses.php';?>

<?php include_once 'footer.php';?>