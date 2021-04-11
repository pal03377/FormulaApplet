<?php $title = 'Sample Tasks'; $header='<span class="tr de samples">Aufgaben-Beispiele</span><span class="tr en samples">Sample Tasks</span>';
$liblist = "'hammer decode translate prepare_page mathquill tex_parser mathquillcss gf09css vkbd vkbdcss'";
$prefix="./"; 
include_once( $prefix . 'header.php' ); 

?>

<script>
function init(){
  // console.log('init... (empty)');
  initTranslation();
}
</script>

<!-- </head> -->

<!-- <body> -->
<h1><?php echo $header; ?></h1>
<h2 class='tr de later'>zum späteren Gebrauch im MediaWiki</h2>
<h2 class='tr en later'>for later use in MediaWiki</h2>
<!-- <div id='keyboard'></div> -->
<!-- <p id="lang_select">
  <input type="radio" name="lang" class="problemeditor language" id="en"></input>
  <label for="en"><span></span>Englisch </label>
  <br />
  <input type="radio" name="lang" class="problemeditor language" id="de" checked></input>
  <label for="de"><span></span>Deutsch </label>
</P> -->
<!-- <button type="button" class="problemeditor language" id="de">DE</button> -->

<!-- <p id="output">output</p> -->
<p class="formula_applet" id="inv862a">3,5 \textcolor{blue}{kWh} = {{result}} \textcolor{blue}{MJ}</p> (12,6MJ) mit alter Syntax: \textcolor <br />
<!-- <p class="formula_applet" id="inv862a">3,5 \unit{kWh} = {{result}} \unit{MJ}</p> (12,6MJ)<br /> -->
<!-- <p class="formula_applet" id="definition_set" def="x > 0">\frac{\sqrt{x^3}}{\sqrt{x}} = {{result}}</p><span class='padding'><span class='tr en oneone'>One variable, one definition set.</span><span class='tr de oneone'>Eine Variable, eine Definitionsmenge.</span></span><br /> -->
<p class="formula_applet" id="definition_set_more_than_numofvar" def="x > 0 && y < 5">\frac{\sqrt{x^3}}{\sqrt{x}} = {{result}}</p><span class='padding'><span class='tr en moredef'>Number of definition sets exceeds number of variables.</span><span class='tr de moredef'>Mehr Definitionsmengen als Variablen.</span></span><br />
<p class="formula_applet" id="definition_set_less_than_numofvar" def="x > 0">\frac{\sqrt{x^3}}{\sqrt{x}} + y \cdot z = {{result}}</p><span class='padding'><span class='tr en morevars'>Number of variables exceeds number of definition sets.</span><span class='tr de morevars'>Mehr Variablen als Definitionsmengen.</span></span><br />
<!-- <p class="formula_applet" id="light-house" data-b64='gOmkT'>s=\sqrt{ h^2 + {{result}} }</p><br /> -->
<p class="formula_applet" id="binom_01">(2u + 7v)^2 = {{result}}</p><br />
<!-- <p class="formula_applet" id="binom_02">(2u + 7v)^2 = 4u^2 + 28uv + {{result}}</p><br /> -->
<!-- <p class="formula_applet" id="fraction">\frac{13t^2 - 5t}{t} = {{result}}</p><br /> -->
<!-- <p class="formula_applet" id="BliBlaBlu" data-b64="N2gMy">17x+4x={{result}}</p><br /> -->
<!-- <p class="formula_applet" id="CheckIfEqual">{{result}} = 0</p><br /> -->
<p class="formula_applet" id="CheckIfTrue">{{result}}</p><br />
<hr>

<?php include_once 'version.php';?>
<?php include_once 'uses.php';?>
<?php include_once 'footer.php';?>