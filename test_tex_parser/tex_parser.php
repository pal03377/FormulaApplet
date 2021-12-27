<?php $title = 'TEX Parser - erase superfluous';
$liblist = "'hammer tex_parser tree_canvas tree2tex mathquill mathquillcss gf09css prepare_page vkbd vkbdcss translate'";
$prefix = "../";
include_once $prefix . 'header.php';
?>
<script>
  // glue.js calls prepare_page(). prepare_page.js is not used, missing in liblist
  // function prepare_page() {
  var tree_canv;
  function init(){
    console.log('$$$ Here is init() from tex_parser.php $$$');
    $(document).ready(function () {
    tree_canv = document.getElementById('treecanvas');
    var myTree = new fa_tree();
    waitfor_hammer( function(){
      makeDraggable(tree_canv);
    });
 
    $(".formula_applet").each(function () {
      var index = $(".formula_applet").index(this);
      var mf_container = MQ.StaticMath(this);
      FAList[index].mathField = mf_container;
      // console.log(index + FAList[index].mathField);
  // mf = MQ.MathField(this, {
    //     handlers: {
    //       edit: function () {
    //         editHandler(index);
    //       }
    //     }
    // });
    //   console.log( index + ' mathquillified: ' + mf.latex());
    //   mathField.push(mf);
    });
    $(".formula_applet").click(function () {
      var index = $(".formula_applet").index(this);
      // console.log('click on ' + index);
      editHandler(index);
      $(".formula_applet").removeClass('selected');
      $(this).addClass('selected');
    });
    // button = $("#cont");
    // tree_canv.click(...) sucks
    var single_step = true;
    if (single_step){
      $( '#treecanvas' ).click( function(event){
        canvasclick_singlestep();
      });
    } else {
      // one step
      $( '#treecanvas' ).click( function(event){
        canvasclick_quick();
      });
    }
  });
}

  function editHandlerDebug(mf_latex) {
    myTree = new fa_tree();
    myTree.leaf.content = mf_latex;
    document.getElementById('output_1').innerHTML = mf_latex + '<br>';
    parsetree_counter.setCounter(0);
    paint_tree(myTree, tree_canv, 'start of parsing');
  }

</script>

<h1><?php echo $title; ?></h1>
<h2>Use mouse left click</h2>

<p id="output_1">output_1</p>
<p id="output_2">output_2</p>
        <!-- <p><button id="check">Check all</button></p> -->
        <!-- p id="version">version</p -->
        <p class="formula_applet" id="fra1">3 \frac{5}{13}a + 7\ \frac{5}{8}a^2-3\ \frac{x}{5}</p><br />
        <p class="formula_applet" id="fra2">3,5\unit{\frac{km}{min}}+0,045\unit{\frac{cm^3}{s^2}}</p><br />
        <p class="formula_applet" id="deg1">7,5a + 3,5° 30' - 4n  - 5' 36'' + 35,8x - 3°12'24'' + 18,2° + 24.7'' - r</p><br />
        <p class="formula_applet" id="deg2">7,5a - 4n + 77° 12,5'' - 35,8x</p><br />
        <p class="formula_applet" id="deg3">- 3°12'24'' + 44' - s + 24.7''</p><br />
        <p class="formula_applet" id="pha1">5,6^3ab^5(p+q)rs^e \cdot 2vw^{\left(n:2\right)}\ \cdot\ \Gamma^\alpha</p><br />
        <p class="formula_applet" id="sub1">5,7y_n+rs_{n+2}-z_{\max}^8</p><br />
        <p class="formula_applet" id="sub2">5,7y^n+rs^{n+2}-z_{\max}^{t-8}</p><br />
        <p class="formula_applet" id="sqrt">\sqrt{2}</p><br />
        <p class="formula_applet" id="sin1">\sin x+5\cosh\left(x\right)+\tan xy+\sin^2\beta-\sin^{2+n}3\alpha</p><br />
        <p class="formula_applet" id="lim1">\lim_{x\to\infty}\frac{4x}{7-5x^2}</p><br />
        <p class="formula_applet" id="log1">\ln x+5\exp\left(x\right)+\log xy+\lg\beta-\log_{2+n}3\alpha+log_749</p><br />
        <p class="formula_applet" id="sqr2">3,4+5\sqrt{a^2+b^2}-(y+5)\sqrt{x+4}</p><br />
        <p class="formula_applet" id="sqr3">\sqrt[3]2</p><br />
        <p class="formula_applet" id="sqr4">\sqrt[7]{x+3y}</p><br />
        <p class="formula_applet" id="ari1">\left(2a+5b\right)-7c+11d-12\left(6x+3y\right)+\left(21x-33y\right)</p><br />
        <p class="formula_applet" id="fra3">2^{\frac{3}{2}}+\frac{3+x}{4+x}={{result}}</p><br />
        <p class="formula_applet" id="sin2">\int_a^b\sin\left(x\right)dx</p><br />
        <p class="formula_applet" id="int1">\int\left(x^3-\frac{7}{5}x\right)dx</p><br />
        <p class="formula_applet" id="int2">\int_{1,5}^{4,8}\frac{y}{y+2}dy</p><br />
        <p class="formula_applet" id="int3">3a + 5\int_{a+1}^{b+2}z^7dz</p><br />
        <p class="formula_applet" id="int4">\int_{a-7}^b\frac{dt}{4+t^2}</p><br />
        <p class="formula_applet" id="ari2">d-e</p><br />
        <p class="formula_applet" id="exp1">7^{\frac{3}{2}}</p><br />
        <p class="formula_applet" id="ari3">\left(\frac{7-y^2}{11+y^3}\right)^{n_i+1,5}</p><br />
        <p class="formula_applet" id="ari4">15+\left[3,5 \cdot ab+\left(2a-3b\right)\left(3a+5b\right)\right]</p><br />
        <p class="formula_applet" id="ari5">78x_{\min}-\left\{99 \cdot x_{\max}+\left(\frac{x_{\alpha}}{x_{\beta}+x_{\gamma}}\right)\right\}</p><br />
        <hr />
<canvas id="treecanvas" width="1200" height="600" style="
border: 1px solid #000000;
position: fixed;
right: 30px;
top: 30px;
transform: scale(1.05);
background-color: #ffffdf !important;">
</canvas>

<?php include_once $prefix . 'footer.php';?>