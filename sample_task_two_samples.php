<?php $title = 'Sample Tasks'; $header='<span class="tr de samples">Aufgaben-Beispiele</span><span class="tr en samples">Sample Tasks</span>';
$liblist = "'hammer decode translate prepare_page mathquill tex_parser mathquillcss gf09css vkbd vkbdcss'";
$prefix="./"; 
include_once( $prefix . 'header.php' ); 
?>

<script>
function init(){
  // console.log('init... (empty)');
  // initTranslation();
 }
</script>

<!-- </head> -->

<!-- <body> -->
<h1><?php echo $header; ?></h1>
<h2 class='tr de later'>zum späteren Gebrauch im MediaWiki</h2>
<h2 class='tr en later'>for later use in MediaWiki</h2>
<p class="formula_applet" id="binom_02">(2u + 7v)^2 = 4u^2 + 28uv + {{result}}</p><br />
<p class="formula_applet" id="light-house" data-b64='gOmkT'>s=\sqrt{ h^2 + {{result}} }</p><br />
<hr>

<?php include_once 'version.php';?>
<?php include_once 'uses.php';?>
<?php include_once 'footer.php';?>